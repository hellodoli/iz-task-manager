import { combineReducers } from 'redux';
import oauthReducer from './oauth';
import taskReducer from './task';
import menuReducer from './menu';

const rootReducer = combineReducers({
  oauthReducer,
  taskReducer,
  menuReducer,
});

export default rootReducer;
