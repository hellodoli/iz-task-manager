import { GET_TASK, SET_TASK } from '../constants/task';
import { SCHEDULE_DATE } from '../constants/schedule';
import {
  splitObjectByKey,
  getInfoDate,
  getScheduleText,
  getTime,
} from '../utils/time';
import Task from '../apis/task';

function filterTaskByToday(cloneTasks, currentDate) {
  const tasksToday = [];
  const tasksOverDue = [];
  const finalTask = [];

  const { date, month, year } = currentDate;
  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const toDayTime = getTime({ inputDate: `${year}-${month}-${date}` });
      const scheduleTime = getTime({ inputDate: new Date(schedule) });

      if (scheduleTime === toDayTime) {
        console.log(cloneTasks[index].schedule);
        tasksToday.push(cloneTasks[index]);
      } else if (scheduleTime < toDayTime) {
        tasksOverDue.push(cloneTasks[index]);
      }
    }
  }

  if (tasksOverDue.length !== 0)
    finalTask.push({ section: 'Overdue', items: tasksOverDue });
  if (tasksToday.length !== 0)
    finalTask.push({
      section: SCHEDULE_DATE.today,
      items: tasksToday,
    });

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

export const getTask = (schedule) => async (dispatch) => {
  try {
    const taskAPI = new Task();
    await taskAPI.getAllTask(schedule);
    const tasks = taskAPI.tasks;

    // get soon as possible
    const curDate = getInfoDate({ inputDate: 'today' });
    console.log('curDate: ', curDate);

    // filter tasks before dispatch
    tasks.forEach((item) => {
      item.isOpen = false;
      item.scheduleText = getScheduleText(item.schedule);
    });
    // clone Task
    const cloneTask01 = JSON.parse(JSON.stringify(tasks));
    const cloneTask02 = JSON.parse(JSON.stringify(tasks));
    const cloneTask03 = JSON.parse(JSON.stringify(tasks));

    // filter by section group (inbox)
    const key = 'section';
    const tasksInbox = splitObjectByKey(key, cloneTask01);
    const sectionTasks = tasksInbox.map((tasks) => tasks[key]);
    // filter by today group (today)
    const tasksToday = filterTaskByToday(cloneTask02, curDate);
    // filter by next upcoming (upcoming) - 3 months
    const tasksUpcoming = filterTaskByUpcoming(cloneTask03, curDate);
    dispatch({
      type: GET_TASK,
      payload: {
        tasks: {
          tasksInbox,
          tasksToday,
          tasksUpcoming,
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
