import { SHOW_LOADING, HIDE_LOADING } from '../constants/loading';

const loadingReducer = (state = null, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return true;
    case HIDE_LOADING:
      return false;
    default:
      return state;
  }
};

export default loadingReducer;
