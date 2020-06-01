import { GET_TASK, SET_TASK } from '../constants/task';
import { SCHEDULE_DATE } from '../constants/schedule';
import {
  splitObjectByKey,
  getInfoDate,
  getScheduleText,
  getTime,
} from '../utils/time';
import TaskAPI from '../apis/task';
import SectionAPI from '../apis/section';

function filterTaskByToday(cloneTasks, currentDate) {
  const tasksToday = {};
  const tasksOverDue = {};
  const tasksOverDueYesterday = {};
  const finalTask = {
    overdue: {
      _id: 'overdue',
      section: 'Overdue',
      order: 0,
      items: {},
    },
    today: {
      _id: 'today',
      section: SCHEDULE_DATE.today,
      order: 1,
      items: {},
    },
  };

  function getTasksOverDueYesterdayOrder(tasksOverDueYesterday, tasksOverDue) {
    const tasksOverDueOb = Object.values(tasksOverDue);
    const tasksOverDueYesterdayOb = Object.values(tasksOverDueYesterday);
    const min = tasksOverDueOb.length;
    const max = min + tasksOverDueYesterdayOb.length;

    const updated = tasksOverDueYesterdayOb.every(
      (task) => task.index.byToday >= min && task.index.byToday < max
    );

    console.log('updated: ', updated);
    if (updated) {
      return tasksOverDueYesterday;
    } else {
      // update to database
      return tasksOverDueYesterday;
    }
  }

  const { date, month, year } = currentDate;
  for (let index = 0; index < cloneTasks.length; index++) {
    const task = cloneTasks[index];
    const schedule = task.schedule;
    if (schedule !== null) {
      const toDayTime = getTime({ inputDate: `${year}-${month}-${date}` });
      const scheduleTime = getTime({ inputDate: new Date(schedule) });
      if (scheduleTime === toDayTime) {
        tasksToday[task._id] = task;
      } else if (scheduleTime < toDayTime) {
        if (task.scheduleText === SCHEDULE_DATE.yesterday) {
          tasksOverDueYesterday[task._id] = task;
        } else {
          tasksOverDue[task._id] = task;
        }
      }
    }
  }

  // mix task overdue
  const tasksOverDueOb = Object.values(tasksOverDue);
  const tasksOverDueYesterdayOb = Object.values(tasksOverDueYesterday);
  if (tasksOverDueYesterdayOb.length !== 0) {
    finalTask.overdue.items = {
      ...tasksOverDue,
      ...getTasksOverDueYesterdayOrder(tasksOverDueYesterday, tasksOverDue),
    };
  } else {
    if (tasksOverDueOb.length !== 0) {
      finalTask.overdue.items = tasksOverDue;
    } else {
      delete finalTask.overdue;
      finalTask.today.order = 0;
    }
  }

  // mix task today
  finalTask.today.items = tasksToday;

  return finalTask;
}

function filterTaskByUpcoming(cloneTasks, currentDate) {
  const tasksOverDue = [];
  const tasksUpcoming = [];
  const finalTask = [];

  const { date, month, year } = currentDate;
  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const toDayTime = getTime({ inputDate: `${year}-${month}-${date}` });
      const scheduleTime = getTime({ inputDate: new Date(schedule) });

      if (scheduleTime < toDayTime) {
        // overdue
        tasksOverDue.push(cloneTasks[index]);
      } else if (scheduleTime > toDayTime) {
        tasksUpcoming.push(cloneTasks[index]); // upcoming
      }
    }
  }

  if (tasksOverDue.length !== 0)
    finalTask.push({ section: 'Overdue', items: tasksOverDue });
  if (tasksUpcoming.length !== 0) {
    const transTasksUpComing = splitObjectByKey('scheduleText', tasksUpcoming);
    transTasksUpComing.forEach((section) =>
      finalTask.push({
        section: section.scheduleText,
        items: section.items,
      })
    );
  }

  return finalTask;
}

function filterTaskBySection(cloneTasks, cloneSections) {
  const nullSectionKey = 0;
  const result = {
    [nullSectionKey]: {
      _id: nullSectionKey,
      section: null,
      order: 0,
      items: {},
    },
  };

  cloneSections.forEach((s) => (result[s._id] = s));

  function mix(taskItem) {
    for (let i = 0; i < cloneSections.length; i++) {
      if (taskItem.section === null) {
        result[nullSectionKey].items[taskItem._id] = taskItem;
        break;
      }

      const s = cloneSections[i];
      if (taskItem.section === s._id) {
        if (s.items) result[s._id].items[taskItem._id] = taskItem;
        else result[s._id].items = { [taskItem._id]: taskItem };
        break;
      }
    }
  }
  // mix sections and taskItem into one
  cloneTasks.forEach(mix);
  // clear section null empty
  if (Object.values(result[nullSectionKey].items).length === 0)
    delete result[nullSectionKey];

  return result;
}

export const getTask = (schedule) => async (dispatch) => {
  try {
    const taskAPI = new TaskAPI();
    await taskAPI.getAllTask(schedule);
    const tasks = taskAPI.tasks;

    // test getAllSection
    const sectionAPI = new SectionAPI();
    await sectionAPI.getAllSection();
    const sections = sectionAPI.sections;

    // get soon as possible
    const curDate = getInfoDate({ inputDate: 'today' });
    console.log('curDate: ', curDate);

    // filter tasks before dispatch
    tasks.forEach((item) => {
      item.isOpen = false;
      item.scheduleText = getScheduleText(item.schedule);
    });

    // clone Section
    /*
      deep change: clone section will change
    */
    const cloneSection = JSON.parse(JSON.stringify(sections));
    // clone Task
    const cloneTask01 = JSON.parse(JSON.stringify(tasks));
    const cloneTask02 = JSON.parse(JSON.stringify(tasks));
    const cloneTask03 = JSON.parse(JSON.stringify(tasks));

    // filter by section group (inbox)
    const tasksInbox = filterTaskBySection(cloneTask01, cloneSection);
    console.log('tasksInbox: ', tasksInbox);
    const sectionTasks = Object.values(tasksInbox).map(
      (tasks) => tasks.section
    );
    console.log('sectionTasks: ', sectionTasks);
    // filter by today group (today)
    const tasksToday = filterTaskByToday(cloneTask02, curDate);
    console.log('tasksToday: ', tasksToday);

    /*// filter by next upcoming (upcoming) - 3 months
    const tasksUpcoming = filterTaskByUpcoming(cloneTask03, curDate);*/

    dispatch({
      type: GET_TASK,
      payload: {
        /*tasks: {
          tasksInbox,
          tasksToday,
          tasksUpcoming,
          sectionTasks,
        },*/
        tasks: {
          tasksInbox,
          tasksToday,
          tasksUpcoming: {},
          sectionTasks,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const setTask = (updateTask) => async (dispatch) => {
  try {
    dispatch({
      type: SET_TASK,
      payload: {
        tasks: { ...updateTask },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
