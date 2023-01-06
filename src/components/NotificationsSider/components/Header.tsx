import { FC } from 'react';

import { GoBackButton } from '@frakt/components/GoBackButton';
import { useUserNotifications } from '@frakt/hooks';
import { Settings } from '@frakt/icons';
import { ContentType } from '../constants';
import { useNotificationsSider } from '../hooks';
import styles from '../NotificationsSider.module.scss';

export const Header: FC = () => {
  const { contentType, changeContentType } = useNotificationsSider();
  const { notifications, clearAll } = useUserNotifications();

  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        {contentType === ContentType.SETTINGS && (
          <GoBackButton
            className={styles.goBackBtn}
            onClick={() => changeContentType(ContentType.NOTIFICATIONS)}
          />
        )}
        <h2 className={styles.title}>
          {contentType !== ContentType.SETTINGS
            ? 'Notifications'
            : 'Notifications settings'}
        </h2>
        {contentType === ContentType.NOTIFICATIONS && (
          <button
            className={styles.settingsBtn}
            onClick={() => changeContentType(ContentType.SETTINGS)}
          >
            <Settings />
          </button>
        )}
      </div>
      {contentType === ContentType.NOTIFICATIONS && !!notifications?.length && (
        <button onClick={clearAll} className={styles.clearBtn}>
          Clear all
        </button>
      )}
    </div>
  );
};
