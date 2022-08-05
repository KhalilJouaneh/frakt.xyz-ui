import { FC } from 'react';

import styles from './NoGraceList.module.scss';

const NoGraceList: FC = () => (
  <div className={styles.container}>
    <div className={styles.title}>No loans on grace at the moment</div>
  </div>
);

export default NoGraceList;
