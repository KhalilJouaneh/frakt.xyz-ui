import { FC } from 'react';

import { Bell } from '@frakt/iconsNew/Bell';
import { BellWithBadge } from '@frakt/iconsNew/BellWithBadge';
import {
  NotificationsSider,
  useNotificationsSider,
} from '../NotificationsSider';
import styles from './NotificationsButton.module.scss';
import { useUserNotifications } from '@frakt/hooks';

export const NotificationsButton: FC = () => {
  const { toggleVisibility } = useNotificationsSider();
  const { hasUnread } = useUserNotifications();

  return (
    <>
      <div className={styles.container} onClick={toggleVisibility}>
        {hasUnread ? <BellWithBadge /> : <Bell />}
      </div>
      <NotificationsSider />
    </>
  );
};
