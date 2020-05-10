import { GET_TASK, SET_TASK } from '../constants/task';
import { splitObjectByKey, getCurrentDateUTC } from '../utils/time';
import Task from '../apis/task';

function filterTaskByToday(cloneTasks) {
  const tasksToday = [];
  const tasksOverDue = [];
  const finalTask = [];

  const { date, month, year } = getCurrentDateUTC();
  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const scheduleDate = parseInt(schedule.substring(8, 10));
      const scheduleMonth = parseInt(schedule.substring(5, 7));
      const scheduleYear = parseInt(schedule.substring(0, 4));
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
  if (tasksToday.length !== 0) finalTask.push({ section: (new Date().toDateString()), items: tasksToday });

  return finalTask;
}

export const getTask = schedule => async dispatch => {
  try {
    const taskAPI = new Task();
    await taskAPI.getAllTask(schedule);
    const tasks = taskAPI.tasks;
    
    // filter tasks before dispatch
    tasks.forEach(item => {
      item.isOpen = false;
      item.originDes = item.des;
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
    const tasksToday = filterTaskByToday(cloneTask02);
    // filter by next upcoming (upcoming)
    const tasksOther = [];
    dispatch({
      type: GET_TASK,
      payload: {
        tasks: {
          tasksInbox,
          tasksToday,
          tasksOther,
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
