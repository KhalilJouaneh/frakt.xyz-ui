import { FC } from 'react';

import Button from '../../../../components/Button';
import styles from './SidebarBulk.module.scss';
import { SolanaIcon } from '../../../../icons';

interface SidebarBulkProps {
  onClick: () => void;
  onBack: () => void;
  onSubmit: () => void;
  selectedBulkValue?: number;
  feeOnDay: number;
}

const SidebarBulk: FC<SidebarBulkProps> = ({
  selectedBulkValue,
  onClick,
  onBack,
  onSubmit,
  feeOnDay,
}) => {
  return (
    <>
      <div className={styles.sidebar}>
        <p className={styles.title}>Borrowing info</p>
        <div className={styles.feesWrapper}>
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 1</p>
            <p className={styles.value}>
              {feeOnDay.toFixed(3)}
              <SolanaIcon />
            </p>
          </div>
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 7</p>
            <p className={styles.value}>
              {(feeOnDay * 7).toFixed(3)} <SolanaIcon />
            </p>
          </div>
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 14</p>
            <p className={styles.value}>
              {(feeOnDay * 14).toFixed(3)}
              <SolanaIcon />
            </p>
          </div>
        </div>
        <div className={styles.sidebarBtnWrapper}>
          <Button onClick={onSubmit} type="secondary" className={styles.btn}>
            Borrow {selectedBulkValue?.toFixed(2)} SOL
          </Button>
          <Button onClick={onBack ? onBack : onClick} className={styles.btn}>
            Change assets
          </Button>
        </div>
      </div>
    </>
  );
};

export default SidebarBulk;
