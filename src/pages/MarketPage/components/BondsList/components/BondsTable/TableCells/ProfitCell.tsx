import { FC } from 'react';

import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const ProfitCell: FC<{ bond: Bond }> = ({ bond }) => {
  const estProfit = (bond?.fbond.amountToReturn / 1e9) * (bond?.interest / 1e2);

  return (
    <div className={styles.row}>
      <span className={styles.value}>
        {(estProfit || 0).toFixed(3)} <Solana />
      </span>
    </div>
  );
};
