import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, markAsRead } from '../../actions/notification';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Badge, ListGroup, Spinner } from 'react-bootstrap';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notification);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="notifications-page">
      <h2 className="mb-4">Notifications</h2>
      
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        <ListGroup variant="flush">
          {notifications.map(notification => (
            <ListGroup.Item 
              key={notification._id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notification._id)}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/questions/${notification.question}`}>
                    {notification.message}
                  </Link>
                  <div className="text-muted small mt-1">
                    <Moment fromNow>{notification.createdAt}</Moment>
                  </div>
                </div>
                {!notification.read && (
                  <Badge pill variant="primary">New</Badge>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Notifications;