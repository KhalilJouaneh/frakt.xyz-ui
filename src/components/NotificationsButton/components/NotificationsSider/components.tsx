import Button from '@frakt/components/Button';
import { GoBackButton } from '@frakt/components/GoBackButton';
import { Loader } from '@frakt/components/Loader';
import { TextInput } from '@frakt/components/TextInput';
import Toggle from '@frakt/components/Toggle';
import { UserAvatar } from '@frakt/components/UserAvatar';
import { useUserInfo, useUserNotifications } from '@frakt/hooks';
import { Alert } from '@frakt/iconsNew/Alert';
import { BellSlash } from '@frakt/iconsNew/BellSlash';
import { Settings } from '@frakt/iconsNew/Settings';
import { getDiscordUri } from '@frakt/utils';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { ContentType, NotificationsSettingsNames } from './constants';

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

export const NoNotificationsContent: FC = () => {
  return (
    <div className={classNames(styles.content, styles.noNotifications)}>
      <BellSlash />
      <p className={styles.noNotificationsText}>
        You have no new notifications
      </p>
    </div>
  );
};

export const LoadingContent: FC = () => {
  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <Loader size="large" />
    </div>
  );
};

export const SettingsContent: FC = () => {
  const { publicKey } = useWallet();

  const { settings, changeSettings } = useUserNotifications();

  const { data, isDiscordConnected, removeUserInfo } = useUserInfo();

  const linkButtonHanlder = async () => {
    if (isDiscordConnected) {
      await removeUserInfo();
      return;
    }

    window.location.href = getDiscordUri(publicKey);
  };

  return (
    <div className={classNames(styles.content)}>
      <h2 className={styles.contentTitle}>Channels</h2>

      <p className={styles.discordSettingsLabel}>Discord</p>
      <div className={styles.discordSettings}>
        <UserAvatar
          className={styles.discordSettingsAvatar}
          imageUrl={data?.avatarUrl}
        />
        <div className={styles.discordSettingsUserInfo}>
          <p className={styles.discordSettingsUserName}>
            {data ? shortenAddress(publicKey.toBase58()) : 'Username'}
          </p>
          <Button
            className={styles.discordSettingsBtn}
            onClick={linkButtonHanlder}
          >
            {isDiscordConnected ? 'Unlink' : 'Link'}
          </Button>
        </div>
      </div>
      <div className={styles.discordAlert}>
        <Alert />
        <p>
          Please note that you should be a member of our{' '}
          <a
            href={process.env.FRAKT_DISCORD_SERVER}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.discordLink}
          >
            server
          </a>{' '}
          to receive notifications
        </p>
      </div>

      <h2
        className={classNames(
          styles.contentTitle,
          styles.contentTitleOffsetTop,
        )}
      >
        Events
      </h2>
      <div className={styles.eventsList}>
        {Object.entries(settings).map(([label, value]) => (
          <div key={label} className={styles.eventsListRow}>
            <p>
              {NotificationsSettingsNames[label] ||
                NotificationsSettingsNames.DEFAULT}
            </p>
            <Toggle
              defaultChecked={value}
              onChange={(value) =>
                changeSettings({ ...settings, [label]: value })
              }
            />
          </div>
        ))}
      </div>
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
