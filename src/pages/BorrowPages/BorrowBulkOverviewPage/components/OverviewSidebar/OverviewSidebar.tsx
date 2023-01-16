import { FC, useMemo } from 'react';

import { Solana } from '@frakt/icons';
import Button from '@frakt/components/Button';
import { BorrowNftBulk } from '@frakt/api/nft';
import { MAX_TIME_BASED_LOAN_DURATION } from '@frakt/utils/loans';

import styles from './OverviewSidebar.module.scss';
import {
  calcBulkTotalValue,
  calcFeePerDay,
  getFeesOnCertainDay,
} from '../../../helpers';

interface OverviewSidebarProps {
  bulkSelection: BorrowNftBulk[];
  onChangeAssets: () => void;
  onBorrow: () => void;
}

export const OverviewSidebar: FC<OverviewSidebarProps> = ({
  bulkSelection,
  onChangeAssets,
  onBorrow,
}) => {
  const borrowValue = calcBulkTotalValue(bulkSelection);
  const feePerDay = calcFeePerDay(bulkSelection);
  const feeOnMaxTimeBasedDay = getFeesOnCertainDay(
    bulkSelection,
    MAX_TIME_BASED_LOAN_DURATION,
  );

  const hideFeeOnMaxTimeBasedDay = useMemo(() => {
    return !!bulkSelection.find(
      ({ timeBased, isPriceBased }) =>
        timeBased.returnPeriodDays === MAX_TIME_BASED_LOAN_DURATION ||
        isPriceBased,
    );
  }, [bulkSelection]);

  return (
    <div className={styles.sidebar}>
      <p className={styles.title}>Borrowing info</p>
      <div className={styles.feesWrapper}>
        <div className={styles.feesRow}>
          <p className={styles.subtitle}>Fee on day 1</p>
          <p className={styles.value}>
            {feePerDay.toFixed(3)}
            <Solana />
          </p>
        </div>
        <div className={styles.feesRow}>
          <p className={styles.subtitle}>Fee on day 7</p>
          <p className={styles.value}>
            {(feePerDay * 7).toFixed(3)} <Solana />
          </p>
        </div>
        {hideFeeOnMaxTimeBasedDay && (
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 14</p>
            <p className={styles.value}>
              {feeOnMaxTimeBasedDay.toFixed(3)}
              <Solana />
            </p>
          </div>
        )}
      </div>
      <div className={styles.sidebarBtnWrapper}>
        <Button type="secondary" onClick={onBorrow} className={styles.btn}>
          Borrow {borrowValue?.toFixed(2)} SOL
        </Button>
        <Button onClick={onChangeAssets} className={styles.btn}>
          Change assets
        </Button>
      </div>
    </div>
  );
};
