import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const InterestCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { interest, apy } = bond;

  return (
    <div className={styles.column}>
      <span className={styles.value}> {(interest / 100 || 0).toFixed(0)}%</span>
      <span className={styles.value}>{apy.toFixed(0)}% APR</span>
    </div>
  );
};
