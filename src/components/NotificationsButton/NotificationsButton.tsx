import { FC } from 'react';

import { Bell } from '@frakt/iconsNew/Bell';
import { useNotificationsSider } from '@frakt/componentsNew/NotificationsSider';
import styles from './NotificationsButton.module.scss';

export const NotificationsButton: FC = () => {
  const { toggleVisibility } = useNotificationsSider();

  return (
    <div className={styles.container} onClick={toggleVisibility}>
      <Bell />
    </div>
  );
};
