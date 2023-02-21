import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const InterestCell: FC<{ bond: Bond }> = ({ bond }) => {
  return (
    <div className={styles.column}>
      <span className={styles.value}>8%</span>
      <span className={styles.value}>208.57% APR</span>
    </div>
  );
};
