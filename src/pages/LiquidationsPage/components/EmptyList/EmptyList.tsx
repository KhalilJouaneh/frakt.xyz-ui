import { FC } from 'react';

import styles from './EmptyList.module.scss';

const EmptyList: FC<{ text: string }> = ({ text }) => (
  <div className={styles.container}>
    <div className={styles.title}>{text}</div>
  </div>
);

export default EmptyList;
