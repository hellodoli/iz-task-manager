import { GET_TASK } from '../constants/task';
import { getCookie } from '../utils/cookies';
import Task from '../apis/task';

export const getTask = schedule => async dispatch => {
  try {
    const token = getCookie('emailToken');
    if (token !== '') {
      const taskAPI = new Task();
      await taskAPI.getAllTask(token, schedule);
      dispatch({
        type: GET_TASK,
        payload: taskAPI.tasks.length > 0 ? taskAPI.tasks : []
      });
    }
  } catch (error) {
    console.log(error);
  }
};
