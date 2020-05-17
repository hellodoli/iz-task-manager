import { GET_TASK, SET_TASK } from '../constants/task';
import { splitObjectByKey, getCurrentDateUTC, setScheduleDate } from '../utils/time';
import Task from '../apis/task';

function getSchedulePiece (schedule) {
  if (schedule === null) return {};
  const scheduleDate = parseInt(schedule.substring(8, 10));
  const scheduleMonth = parseInt(schedule.substring(5, 7));
  const scheduleYear = parseInt(schedule.substring(0, 4));
  return {
    scheduleDate,
    scheduleMonth,
    scheduleYear
  };
}

function filterTaskByToday(cloneTasks, currentDate) {
  const tasksToday = [];
  const tasksOverDue = [];
  const finalTask = [];

  const { date, month, year } =  currentDate;
  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const { scheduleDate, scheduleMonth, scheduleYear } = getSchedulePiece(schedule);
      if (scheduleYear === year && scheduleMonth === month) {
        if (scheduleDate === date) {
          tasksToday.push(cloneTasks[index]);
        } else if (scheduleDate < date) {
          tasksOverDue.push(cloneTasks[index]);
        }
      }
    }
  }

  if (tasksOverDue.length !== 0) finalTask.push({ section: 'Overdue', items: tasksOverDue });
  if (tasksToday.length !== 0) finalTask.push({ section: `Today - ${(new Date().toDateString())}`, items: tasksToday });

  return finalTask;
}

function filterTaskByUpcoming(cloneTasks, currentDate) {
  const tasksOverDue = [];
  const tasksUpcoming = [];
  const finalTask = [];

  const { date, month, year } =  currentDate;
  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const { scheduleDate, scheduleMonth, scheduleYear } = getSchedulePiece(schedule);
      if (scheduleMonth === month && scheduleYear === year) {
        if (scheduleDate < date) { // overdue
          tasksOverDue.push(cloneTasks[index]);
        } else {
          tasksUpcoming.push(cloneTasks[index]);
        }
      }
    }
  }

  if (tasksOverDue.length !== 0) finalTask.push({ section: 'Overdue', items: tasksOverDue });
  if (tasksUpcoming.length !== 0) {
    const transTasksUpComing = splitObjectByKey('scheduleText', tasksUpcoming);
    transTasksUpComing.forEach(section => finalTask.push({
      section: section.scheduleText,
      items: section.items
    }));
  }

  return finalTask;
}

export const getTask = schedule => async dispatch => {
  try {
    const taskAPI = new Task();
    await taskAPI.getAllTask(schedule);
    const tasks = taskAPI.tasks;

    // get soon as possible
    const curDate = getCurrentDateUTC();

    // filter tasks before dispatch
    tasks.forEach(item => {
      item.isOpen = false;
      item.scheduleText = setScheduleDate(item.schedule);
    });
    // clone Task
    const cloneTask01 = JSON.parse(JSON.stringify(tasks));
    const cloneTask02 = JSON.parse(JSON.stringify(tasks));
    const cloneTask03 = JSON.parse(JSON.stringify(tasks));
    
    // filter by section group (inbox)
    const key = 'section';
    const tasksInbox = splitObjectByKey(key, cloneTask01);
    const sectionTasks = tasksInbox.map(tasks => tasks[key]);
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
          sectionTasks
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const setTask = updateTask => async dispatch => {
  try {
    dispatch({
      type: SET_TASK,
      payload: {
        tasks: { ...updateTask }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addTask = newTask => async dispatch => {
  try {
    const taskAPI = new Task();
    await taskAPI.addTask(newTask);
    if (taskAPI.newTask !== null)
      getTask();
  } catch (error) {
    console.log(error);
  }
};
