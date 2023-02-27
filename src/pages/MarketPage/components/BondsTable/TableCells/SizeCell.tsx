import { FC } from 'react';
import classNames from 'classnames';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const SizeCell: FC<{ bond: Bond; isMobile?: boolean }> = ({
  bond,
  isMobile,
}) => {
  const { amountOfUserBonds } = bond;
  const bSolLamports = amountOfUserBonds;

  return (
    <div
      className={classNames(styles.column, {
        [styles.columnMobile]: isMobile,
      })}
    >
      <span className={styles.value}>
        {(bSolLamports / BOND_SOL_DECIMAIL_DELTA || 0).toFixed(2)}
        <Solana />
      </span>
      <span className={classNames(styles.value, styles.highestLtvColor)}>
        {parseFloat(bond.fbond.ltvPercent || '0').toFixed(0)} %
      </span>
    </div>
  );
};
