import { GET_TASK } from '../constants/task';

const taskReducer = (state = [], action) => {
  switch (action.type) {
    case GET_TASK:
      return [...state, ...action.payload];
    default:
      return state;
  }
};

export default taskReducer;
