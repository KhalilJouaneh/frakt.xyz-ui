import { useIntersectionObserver, useUserNotifications } from '@frakt/hooks';
import classNames from 'classnames';
import { FC, useEffect, useRef } from 'react';

import { Notification } from '@frakt/api/user';
import {
  Header,
  LoadingContent,
  NoNotificationsContent,
  SettingsContent,
  SetUpContent,
  SignMessageContent,
} from './components';
import { ContentType } from './constants';
import { useNotificationsSider } from './hooks';
import styles from './NotificationsSider.module.scss';
import moment from 'moment';

export const NotificationsSider: FC = () => {
  const { isVisible, contentType } = useNotificationsSider();

  return (
    <div
      className={classNames(styles.root, { [styles.rootHidden]: !isVisible })}
    >
      <Header />
      {contentType === ContentType.SETTINGS && <SettingsContent />}
      {contentType === ContentType.LOADING && <LoadingContent />}
      {contentType === ContentType.SIGN_MESSAGE && <SignMessageContent />}
      {contentType === ContentType.NOTIFICATIONS && <NotificationsContent />}
      {contentType === ContentType.SET_UP && <SetUpContent />}
    </div>
  );
};

const NotificationsContent = () => {
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
