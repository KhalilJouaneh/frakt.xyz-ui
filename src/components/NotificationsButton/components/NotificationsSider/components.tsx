import Button from '@frakt/components/Button';
import { GoBackButton } from '@frakt/components/GoBackButton';
import { TextInput } from '@frakt/components/TextInput';
import { useUserNotifications } from '@frakt/hooks';
import { Settings } from '@frakt/iconsNew/Settings';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { ContentType } from './constants';

import { useNotificationsSider } from './hooks';
import styles from './NotificationsSider.module.scss';

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

export const SignMessageContent: FC = () => {
  const authorize = () => {};

  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <h3 className={styles.contentTitle}>Please sign message</h3>
      <p className={styles.signMessageSubtitle}>to set up notifications</p>
      <Button
        type="secondary"
        className={styles.signMessageBtn}
        onClick={authorize}
      >
        Sign
      </Button>
    </div>
  );
};

export const SetUpContent: FC = () => {
  const [telegram, setTelegram] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log({
      telegram,
      email,
      phone,
    });
  };

  return (
    <div className={classNames(styles.content, styles.contentSetUp)}>
      <TextInput
        label="Telegram username"
        onChange={setTelegram}
        placeholder="@degenuser"
      />
      <TextInput
        label="Email address"
        onChange={setEmail}
        placeholder="degenuser@frakt.xyz"
      />
      <TextInput
        label="Phone number"
        onChange={setPhone}
        placeholder="+00 000 000 000"
      />

      <Button type="secondary" onClick={onSubmit}>
        Save
      </Button>
    </div>
  );
};
