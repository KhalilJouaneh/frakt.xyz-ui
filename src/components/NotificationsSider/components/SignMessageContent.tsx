import { FC } from 'react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';
import styles from '../NotificationsSider.module.scss';

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
