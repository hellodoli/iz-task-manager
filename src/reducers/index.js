import { combineReducers } from 'redux';
import oauthReducer from './oauth';
import taskReducer from './task';

const rootReducer = combineReducers({
  oauthReducer,
  taskReducer
});

export default rootReducer;
