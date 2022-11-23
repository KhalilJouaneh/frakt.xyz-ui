import { FC } from 'react';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '@frakt/components/Button';
import Toggle from '@frakt/components/Toggle';
import { UserAvatar } from '@frakt/components/UserAvatar';
import { useUserInfo, useUserNotifications } from '@frakt/hooks';
import { Alert } from '@frakt/iconsNew/Alert';
import { getDiscordUri } from '@frakt/utils';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import { NotificationsSettingsNames } from '../constants';
import styles from '../NotificationsSider.module.scss';

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
