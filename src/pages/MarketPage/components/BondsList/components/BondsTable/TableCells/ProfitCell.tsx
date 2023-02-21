import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const ProfitCell: FC<{ bond: Bond }> = ({ bond }) => {
  return (
    <div className={styles.row}>
      <span className={styles.value}>
        55.8
        <Solana />
      </span>
    </div>
  );
};
