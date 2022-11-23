import classNames from 'classnames';
import { FC } from 'react';

import { Loader } from '@frakt/components/Loader';
import styles from '../NotificationsSider.module.scss';

export const LoadingContent: FC = () => {
  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <Loader size="large" />
    </div>
  );
};
