import { FC } from 'react';
import classNames from 'classnames';

import { Bond } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';
import {
  BOND_SOL_DECIMAIL_DELTA,
  colorByPercentOffers,
  getColorByPercent,
} from '@frakt/utils/bonds';

import styles from './TableCells.module.scss';

export const SizeCell: FC<{ bond: Bond; isMobile?: boolean }> = ({
  bond,
  isMobile,
}) => {
  const { amountOfUserBonds, fbond } = bond;
  const bSolLamports = amountOfUserBonds;

  const ltvValue = parseFloat(fbond.ltvPercent);
  const colorLTV =
    getColorByPercent(ltvValue, colorByPercentOffers) ||
    colorByPercentOffers[100];

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
      <span
        style={{ color: colorLTV }}
        className={classNames(styles.value, styles.highestLtvColor)}
      >
        {(ltvValue || 0)?.toFixed(0)}% LTV
      </span>
    </div>
  );
};
