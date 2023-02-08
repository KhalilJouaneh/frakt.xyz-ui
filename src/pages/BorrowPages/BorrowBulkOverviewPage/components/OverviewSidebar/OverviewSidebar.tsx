import { FC } from 'react';

import { Alert, Solana } from '@frakt/icons';
import Button from '@frakt/components/Button';
import { Order, useBorrow } from '@frakt/pages/BorrowPages/cartState';

import styles from './OverviewSidebar.module.scss';
import { Pair } from '@frakt/api/bonds';
import { calcCartFees, isBulkHasDifferentDurations } from './helpers';

interface OverviewSidebarProps {
  orders: Order[];
  pairs: Pair[];
  onChangeAssets: () => void;
  onBorrow: () => void;
}

export const OverviewSidebar: FC<OverviewSidebarProps> = ({
  orders,
  pairs,
  onChangeAssets,
  onBorrow,
}) => {
  const { totalBorrowValue } = useBorrow();

  const fees = calcCartFees({
    pairs,
    orders,
  });

  const isDifferentDurations = isBulkHasDifferentDurations({
    orders,
    pairs,
  });

  return (
    <div className={styles.sidebar}>
      <p className={styles.title}>Borrowing info</p>
      <div className={styles.feesWrapper}>
        {fees.map(([label, value]) =>
          value ? (
            <div key={label} className={styles.feesRow}>
              <p className={styles.subtitle}>Fee on {label}</p>
              <p className={styles.value}>
                {(value / 1e8).toFixed(3)}
                <Solana />
              </p>
            </div>
          ) : null,
        )}
      </div>
      {isDifferentDurations && (
        <div className={styles.differentDurationsMsg}>
          <Alert />
          Please note that you have loans with different durations
        </div>
      )}

      <div className={styles.sidebarBtnWrapper}>
        <Button type="secondary" onClick={onBorrow} className={styles.btn}>
          Borrow {(totalBorrowValue / 1e9)?.toFixed(2)} SOL
        </Button>
        <Button onClick={onChangeAssets} className={styles.btn}>
          Change assets
        </Button>
      </div>
    </div>
  );
};
