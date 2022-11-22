import { shortenAddress } from '@frakt-protocol/frakt-sdk/lib/pools';
import Button from '@frakt/components/Button';
import { Loader } from '@frakt/components/Loader';
import { UserAvatar } from '@frakt/components/UserAvatar';
import { useUserInfo, useUserNotifications } from '@frakt/hooks';
import { Alert } from '@frakt/iconsNew/Alert';
import { BellSlash } from '@frakt/iconsNew/BellSlash';
import { getDiscordUri } from '@frakt/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { FC } from 'react';

import { Notification } from '@frakt/api/user';
import { Header, SetUpContent, SignMessageContent } from './components';
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
  const { notifications, isLoading } = useUserNotifications();

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
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: FC<NotificationCardProps> = ({ notification }) => {
  const { image, message, date, isRead } = notification;

  return (
    <div className={styles.notificationCard}>
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

const NoNotificationsContent = () => {
  return (
    <div className={classNames(styles.content, styles.noNotifications)}>
      <BellSlash />
      <p className={styles.noNotificationsText}>
        You have no new notifications
      </p>
    </div>
  );
};

const LoadingContent = () => {
  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <Loader size="large" />
    </div>
  );
};

const SettingsContent = () => {
  const { publicKey } = useWallet();

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
    </div>
  );
};
