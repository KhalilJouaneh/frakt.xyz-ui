import { FC } from 'react';

import { Bell } from '@frakt/iconsNew/Bell';
import { BellWithBadge } from '@frakt/iconsNew/BellWithBadge';
import { useBurgerMenu } from '@frakt/components/BurgerMenu';
import { useUserNotifications } from '@frakt/hooks';
import {
  NotificationsSider,
  useNotificationsSider,
} from '../NotificationsSider';
import styles from './NotificationsButton.module.scss';

export const NotificationsButton: FC = () => {
  const { isVisible, toggleVisibility } = useNotificationsSider();
  const { setVisibility: setBurgerMenuVisibility } = useBurgerMenu();
  const { hasUnread } = useUserNotifications();

  const onIconClick = () => {
    if (!isVisible) {
      setBurgerMenuVisibility(false);
    }
    toggleVisibility();
  };

  return (
    <>
      <div className={styles.container} onClick={onIconClick}>
        {hasUnread ? <BellWithBadge /> : <Bell />}
      </div>
      <NotificationsSider />
    </>
  );
};
