import {
  GET_NOTIFICATIONS,
  NOTIFICATION_ERROR,
  MARK_AS_READ
} from '../actions/types';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        unreadCount: payload.filter(n => !n.read).length,
        loading: false
      };
    case MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: state.unreadCount - 1
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}