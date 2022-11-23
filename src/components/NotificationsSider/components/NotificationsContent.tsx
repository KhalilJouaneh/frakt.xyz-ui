import { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { BellSlash } from '@frakt/iconsNew/BellSlash';
import { useIntersectionObserver, useUserNotifications } from '@frakt/hooks';
import { Notification } from '@frakt/api/user';
import styles from '../NotificationsSider.module.scss';
import { LoadingContent } from './LoadingContent';

export const NotificationsContent: FC = () => {
  const { notifications, isLoading, markRead } = useUserNotifications();

  if (isLoading) {
    return <LoadingContent />;
  }

  if (!notifications?.length) {
    return <NoNotificationsContent />;
  }

  return (
    <div className={styles.content}>
      <div className={styles.notficationsList}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            markAsRead={() => markRead([notification.id])}
          />
        ))}
      </div>
    </div>
  );
};

const NoNotificationsContent: FC = () => {
  return (
    <div className={classNames(styles.content, styles.noNotifications)}>
      <BellSlash />
      <p className={styles.noNotificationsText}>
        You have no new notifications
      </p>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  markAsRead: () => void;
}

const NotificationCard: FC<NotificationCardProps> = ({
  notification,
  markAsRead,
}) => {
  const { image, message, date, isRead } = notification;

  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isRead) return;

    let timerId: ReturnType<typeof setTimeout> = null;
    if (isVisible) {
      timerId = setTimeout(() => markAsRead(), 1000);
    } else {
      clearTimeout(timerId);
    }

    return () => clearTimeout(timerId);
  }, [isVisible, isRead, markAsRead]);

  return (
    <div className={styles.notificationCard} ref={ref}>
      <div
        className={classNames(styles.notificationCardInfo, {
          [styles.notificationCardInfoRead]: isRead,
        })}
      >
        {image && (
          <img
            src={image}
            alt="Notification image"
            className={styles.notificationCardImg}
          />
        )}
        <p>{message?.body}</p>
      </div>
      <p className={styles.notificationCardDate}>
        {moment.unix(date).fromNow()}
      </p>
    </div>
  );
};
