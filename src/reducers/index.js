import { combineReducers } from 'redux';
import oauthReducer from './oauth';
import taskReducer from './task';
import menuReducer from './menu';
import dlTheme from './theme';

const rootReducer = combineReducers({
  oauthReducer,
  taskReducer,
  menuReducer,
  dlTheme,
});

export default rootReducer;
