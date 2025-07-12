import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_NOTIFICATIONS,
  NOTIFICATION_ERROR,
  MARK_AS_READ
} from './types';

// Get all notifications
export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get('/api/notifications');

    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create notification
export const createNotification = formData => async dispatch => {
  try {
    await axios.post('/api/notifications', formData);
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Mark as read
export const markAsRead = id => async dispatch => {
  try {
    await axios.put(`/api/notifications/${id}/read`);

    dispatch({
      type: MARK_AS_READ,
      payload: id
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};