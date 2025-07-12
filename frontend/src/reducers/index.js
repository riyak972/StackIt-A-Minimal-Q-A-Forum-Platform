import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import question from './question';
import answer from './answer';
import notification from './notification';

export default combineReducers({
  alert,
  auth,
  question,
  answer,
  notification
});