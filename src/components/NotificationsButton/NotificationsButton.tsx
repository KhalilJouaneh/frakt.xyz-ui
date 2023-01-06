import { FC, useRef } from 'react';

import { Bell, BellWithBadge } from '@frakt/icons';
import { useBurgerMenu } from '@frakt/components/BurgerMenu';
import { useUserNotifications, useOnClickOutside } from '@frakt/hooks';
import {
  NotificationsSider,
  useNotificationsSider,
} from '../NotificationsSider';
import styles from './NotificationsButton.module.scss';
import classNames from 'classnames';

const BUTTON_ID = 'notifications-button';

export const NotificationsButton: FC = () => {
  const { isVisible, toggleVisibility, setVisibility } =
    useNotificationsSider();
  const { setVisibility: setBurgerMenuVisibility } = useBurgerMenu();
  const { hasUnread } = useUserNotifications();

  const buttonRef = useRef();
  const siderRef = useRef();
  useOnClickOutside(siderRef, (event) => {
    const targetAsAny = event.target as any;

    const ignore =
      targetAsAny === buttonRef.current ||
      targetAsAny.closest(`#${BUTTON_ID}`) === buttonRef.current;

    if (ignore) return;

    setVisibility(false);
  });

  const onIconClick = () => {
    toggleVisibility();
    if (!isVisible) {
      setBurgerMenuVisibility(false);
    }
  };

  return (
    <>
      <button
        id={BUTTON_ID}
        className={classNames(styles.button, {
          [styles.buttonActive]: isVisible,
        })}
        onClick={onIconClick}
        ref={buttonRef}
      >
        {hasUnread ? <BellWithBadge /> : <Bell />}
      </button>
      <NotificationsSider ref={siderRef} />
    </>
  );
};
