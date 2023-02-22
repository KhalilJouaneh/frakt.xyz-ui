import { FC } from 'react';
import classNames from 'classnames';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const SizeCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { amountOfUserBonds } = bond;
  const bSolLamports = amountOfUserBonds;
  console.log(bond);
  return (
    <div className={styles.column}>
      <span className={styles.value}>
        {(bSolLamports / BOND_SOL_DECIMAIL_DELTA || 0).toFixed(2)}
        <Solana />
      </span>
      <span className={classNames(styles.value, styles.highestLtvColor)}>
        50% LTV
      </span>
    </div>
  );
};
