import { GET_TASK, SET_TASK } from '../constants/task';
import { getCookie } from '../utils/cookies';
import { splitObjectByKey } from '../utils/ob';
import Task from '../apis/task';

function filterTaskByToday(cloneTasks) {
  const tasksToday = [];
  const tasksOverDue = [];
  const finalTask = [];

  const d = new Date();
  const curDate = d.toJSON(); // transfer to UTC
  const curDateString = d.toDateString();
  const date = parseInt(curDate.substring(8, 10));
  const month = parseInt(curDate.substring(5, 7));
  const year = parseInt(curDate.substring(0, 4));

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
  if (tasksToday.length !== 0) finalTask.push({ section: curDateString, items: tasksToday });

  return finalTask;
}

export const getTask = schedule => async dispatch => {
  try {
    const token = getCookie('emailToken');
    if (token !== '') {
      const taskAPI = new Task();
      await taskAPI.getAllTask(token, schedule);
      const tasks = taskAPI.tasks;
      if (tasks.length > 0) {
        // filter tasks before dispatch
        tasks.forEach(item => {
          item.isOpen = false;
          item.originDes = item.des;
        });
        const cloneTask01 = JSON.parse(JSON.stringify(tasks));
        const cloneTask02 = JSON.parse(JSON.stringify(tasks));
        
        // filter by section group (inbox)
        const tasksInbox = splitObjectByKey('section', cloneTask01);
        // filter by today group (today)
        const tasksToday = filterTaskByToday(cloneTask02);
        // filter by next 7 days (other)
        const tasksOther = [];
      
        dispatch({
          type: GET_TASK,
          payload: {
            tasks: {
              tasksInbox,
              tasksToday,
              tasksOther
            }
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const setTask = updateTask => async dispatch => {
  try {
    dispatch({
      type: SET_TASK,
      payload: {
        tasks: {
          ...updateTask
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
