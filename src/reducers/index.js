import { combineReducers } from 'redux';
import oauthReducer from './oauth';
import taskReducer from './task';
import menuReducer from './menu';
import dlTheme from './theme';
import loadingReducer from './loading';

const rootReducer = combineReducers({
  oauthReducer,
  taskReducer,
  menuReducer,
  dlTheme,
  isLoading: loadingReducer,
});

export default rootReducer;
