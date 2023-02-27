import { FC } from 'react';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const ProfitCell: FC<{ bond: Bond }> = ({ bond }) => {
  const estProfit = calcEstimateProfit(bond);

  return (
    <div className={styles.row}>
      <span className={styles.value}>
        {(estProfit || 0).toFixed(3)} <Solana />
      </span>
    </div>
  );
};

export const calcEstimateProfit = (bond: Bond): number => {
  const { interest, amountOfUserBonds } = bond;
  const estProfit =
    (amountOfUserBonds / BOND_SOL_DECIMAIL_DELTA) * (interest / 1e4);

  return estProfit;
};
