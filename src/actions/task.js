import { GET_TASK, SET_TASK, keys } from '../constants/task';
import { SCHEDULE_DATE } from '../constants/schedule';
import { splitObjectByKey, getScheduleText, getTime } from '../utils/time';
import history from '../history';
import TaskAPI from '../apis/task';
import SectionAPI from '../apis/section';
import UserAPI from '../apis/user';

async function filterScheduleTask(cloneTasks, currentDate, updated) {
  try {
    const { overdueKey, todayKey, upcomingKey } = keys;
    const tasksToday = {};
    const tasksUpcoming = [];
    const tasksOverDue = {};
    const tasksOverDueYesterday = {};

    const finalTasksToday = {
      [todayKey]: {
        _id: todayKey,
        section: SCHEDULE_DATE.today,
        order: 1,
        items: {},
      },
    };
    const finalTasksUpcoming = {};

    function collectTaskOverDue(task) {
      if (updated) {
        tasksOverDue[task._id] = task;
      } else {
        if (task.scheduleText === SCHEDULE_DATE.yesterday) {
          tasksOverDueYesterday[task._id] = task;
        } else {
          tasksOverDue[task._id] = task;
        }
      }
    }

    function success(arrTasksOverDue, arrTasksOverDueYesterday) {
      if (arrTasksOverDue.length > 0 || arrTasksOverDueYesterday.length > 0) {
        finalTasksToday[overdueKey] = {
          _id: overdueKey,
          section: 'Overdue',
          order: 0,
          items: {
            ...tasksOverDue,
            ...tasksOverDueYesterday,
          },
        };
        finalTasksUpcoming[overdueKey] = {
          _id: overdueKey,
          section: 'Overdue',
          order: 0,
          items: {
            ...tasksOverDue,
            ...tasksOverDueYesterday,
          },
        };
      }
    }

    // collect to array
    for (let i = 0; i < cloneTasks.length; i++) {
      const task = cloneTasks[i];
      const schedule = task.schedule;
      if (schedule !== null) {
        const todayTime = getTime({ inputDate: currentDate });
        const scheduleTime = getTime({ inputDate: new Date(schedule) });
        if (scheduleTime === todayTime) {
          // today
          tasksToday[task._id] = task;
          tasksUpcoming.push(task);
        } else if (scheduleTime < todayTime) {
          // overdue
          collectTaskOverDue(task);
        } else if (scheduleTime > todayTime) {
          // upcoming
          tasksUpcoming.push(task);
        }
      }
    }

    // processing
    // 1. Overdue
    let arrNeedUpdateTask = [];
    const arrTasksOverDueYesterday = Object.values(tasksOverDueYesterday);
    const length = arrTasksOverDueYesterday.length;

    const arrTasksOverDue = Object.values(tasksOverDue);
    arrTasksOverDue.sort((a, b) => a.index.byToday - b.index.byToday);

    if (length === 0) {
      // updated or not updated but dont have new overdue task
      // do nothing
    } else {
      // not updated
      // update task overdue old
      for (let i = 0; i < arrTasksOverDue.length; i++) {
        const task = arrTasksOverDue[i];
        if (task.index.byToday !== i) {
          const index = {
            bySection: -1,
            byToday: i,
            byUpcoming: i,
          };
          task.index = index;
          arrNeedUpdateTask.push({
            _id: task._id,
            index,
          });
        }
      }
      // update new task overdue
      let min = arrTasksOverDue.length;
      for (let i = 0; i < length; i++) {
        const task = arrTasksOverDueYesterday[i];
        if (task.index.byToday !== min) {
          const index = {
            bySection: -1,
            byToday: min,
            byUpcoming: min,
          };
          task.index = index;
          arrNeedUpdateTask.push({
            _id: task._id,
            index,
          });
        }
        min++;
      }
    }

    if (arrNeedUpdateTask.length > 0) {
      const taskAPI = new TaskAPI();
      await taskAPI.updateManyTask(arrNeedUpdateTask);
      if (taskAPI.isUpdateManySuccess) {
        success(arrTasksOverDue, arrTasksOverDueYesterday);
      } else {
        throw new Error(
          'Error from update arrange task. Please login again T_T'
        );
      }
    } else {
      success(arrTasksOverDue, arrTasksOverDueYesterday);
    }

    // 2. Upcoming
    const transTasksUpComing = splitObjectByKey('scheduleText', tasksUpcoming);
    console.log('transTasksUpComing: ', transTasksUpComing);
    transTasksUpComing.forEach((section, index) => {
      const count = index + 1;
      const key = `${upcomingKey}${count}`;
      finalTasksUpcoming[key] = {
        _id: key,
        section: section.scheduleText,
        order: count,
        items: {},
      };
      section.items.forEach(
        (task) => (finalTasksUpcoming[key].items[task._id] = task)
      );
    });

    // 3. Today
    finalTasksToday[todayKey].items = { ...tasksToday };

    return {
      tasksToday: finalTasksToday,
      tasksUpcoming: finalTasksUpcoming,
    };
  } catch (error) {
    console.error(error.message);
    alert(error.message);
    history.push('/show');
  }
}

function filterTaskBySection(cloneTasks, cloneSections) {
  const { nullSectionKey } = keys;
  const result = {
    [nullSectionKey]: {
      _id: nullSectionKey,
      section: null,
      order: 0,
      items: {},
    },
  };

  cloneSections.forEach((s) => {
    result[s._id] = s;
    result[s._id].items = {};
  });

  function mix(taskItem) {
    if (taskItem.section === null) {
      result[nullSectionKey].items[taskItem._id] = taskItem;
    } else {
      const keys = Object.keys(result);
      if (keys.includes(taskItem.section)) {
        result[taskItem.section].items[taskItem._id] = taskItem;
      }
    }
  }
  // mix sections and taskItem into one
  cloneTasks.forEach(mix);
  return result;
}

export const getTask = (schedule) => async (dispatch, getState) => {
  try {
    // get soon as possible
    const curDate = new Date();
    console.log('curDate: ', curDate);
    const todayTime = getTime({ inputDate: curDate });

    const user = getState().oauthReducer.user;
    const userOverDate = user.overdate;
    console.log('userOverDate: ', userOverDate);
    const userOverDateTime = getTime({ inputDate: new Date(userOverDate) });

    const updated = todayTime === userOverDateTime;
    if (!updated) {
      console.log('>>>update user_overdate<<<');
      const userAPI = new UserAPI();
      await userAPI.editUser({ overdate: curDate.toJSON() });
      if (!userAPI.isUpdateUserSuccess) {
        throw new Error(
          'Error from update user_overdate. Please login again T_T'
        );
      }
    }

    const taskAPI = new TaskAPI();
    await taskAPI.getAllTask(schedule);
    const tasks = taskAPI.tasks;

    // test getAllSection
    const sectionAPI = new SectionAPI();
    await sectionAPI.getAllSection();
    const sections = sectionAPI.sections;

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

    // filter by section group (inbox)
    const tasksInbox = filterTaskBySection(cloneTask01, cloneSection);
    console.log('tasksInbox: ', tasksInbox);

    // get all section
    const sectionTasksIdArr = [];
    const sectionTasksNameArr = [];
    Object.values(tasksInbox).forEach(({ section, _id }) => {
      sectionTasksIdArr.push(_id);
      sectionTasksNameArr.push(section);
    });
    const sectionTasks = [sectionTasksNameArr, sectionTasksIdArr];
    console.log('sectionTasks: ', sectionTasks);

    // filter by today group (today)
    // filter by next upcoming (upcoming)
    const { tasksToday, tasksUpcoming } = await filterScheduleTask(
      cloneTask02,
      curDate,
      updated
    );
    console.log('tasksToday: ', tasksToday);
    console.log('tasksUpcoming: ', tasksUpcoming);

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
    console.error(error.message);
    alert(error.message);
    history.push('/show');
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
