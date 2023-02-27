import classNames from 'classnames';
import { FC } from 'react';

import styles from './EmptyList.module.scss';

const EmptyList: FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => (
  <div className={classNames(styles.container, className)}>
    <div className={styles.title}>{text}</div>
  </div>
);

export default EmptyList;
