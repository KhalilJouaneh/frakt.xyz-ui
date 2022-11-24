import { forwardRef } from 'react';
import classNames from 'classnames';

import { ContentType } from './constants';
import { useNotificationsSider } from './hooks';
import styles from './NotificationsSider.module.scss';
import { Header } from './components/Header';
import { LoadingContent } from './components/LoadingContent';
import { NotificationsContent } from './components/NotificationsContent';
import { SetUpContent } from './components/SetUpContent';
import { SettingsContent } from './components/SettingsContent';
import { SignMessageContent } from './components/SignMessageContent';

export const NotificationsSider = forwardRef<HTMLDivElement>((props, ref) => {
  const { isVisible, contentType } = useNotificationsSider();

  return (
    <div
      onClick={(event) => event}
      className={classNames(styles.root, { [styles.rootHidden]: !isVisible })}
      ref={ref}
    >
      <Header />
      {contentType === ContentType.SETTINGS && <SettingsContent />}
      {contentType === ContentType.LOADING && <LoadingContent />}
      {contentType === ContentType.SIGN_MESSAGE && <SignMessageContent />}
      {contentType === ContentType.NOTIFICATIONS && <NotificationsContent />}
      {contentType === ContentType.SET_UP && <SetUpContent />}
    </div>
  );
});

NotificationsSider.displayName = 'NotificationsSider';
