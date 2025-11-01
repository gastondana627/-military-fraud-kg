import React, { useEffect } from 'react';

export default function NotificationCenter({ notifications, onRemove }) {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function Notification({ notification, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification ${notification.type}`}>
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-text">{notification.message}</span>
      <span
        className="notification-close"
        onClick={() => onRemove(notification.id)}
      >
        ✕
      </span>
    </div>
  );
}
