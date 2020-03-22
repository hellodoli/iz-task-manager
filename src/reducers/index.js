import { combineReducers } from 'redux';
import oauthReducer from './oauth';

const rootReducer = combineReducers({
  oauthReducer
});

export default rootReducer;