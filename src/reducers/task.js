import { GET_TASK, SET_TASK, ADD_TASK } from '../constants/task';

const INTIAL_STATE = {
  tasksInbox: [],
  tasksToday: [],
  tasksOther: [],
  sectionTasks: [],
  fetchDone: false
};

const taskReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case GET_TASK:
      alert('yes');
      return { ...state, ...action.payload.tasks, fetchDone: true };
    case SET_TASK:
      return { ...state, ...action.payload.tasks };
    default:
      return state;
  }
};

export default taskReducer;
