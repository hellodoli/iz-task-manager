import { GET_TASK, SET_TASK } from '../constants/task';

const INTIAL_STATE = {
  tasksInbox: [],
  tasksToday: [],
  tasksUpcoming: [],
  sectionTasks: [],
  fetchDone: false,
};

const taskReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case GET_TASK:
      return { ...state, ...action.payload.tasks, fetchDone: true };
    case SET_TASK:
      return { ...state, ...action.payload.tasks };
    default:
      return state;
  }
};

export default taskReducer;
