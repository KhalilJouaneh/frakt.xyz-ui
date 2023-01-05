import { FC } from 'react';

import Button from '../../../../components/Button';
import styles from './SidebarBulk.module.scss';
import { Solana } from '@frakt/icons';
import {
  ConfirmModal,
  useConfirmModal,
} from '../../../../components/ConfirmModal';

interface SidebarBulkProps {
  onClick: () => void;
  onBack: () => void;
  onSubmit: () => void;
  selectedBulkValue?: number;
  feeOnDay: number;
  feesOnMaxDuration?: number;
  isMaxReturnPeriodDays?: boolean;
}

const SidebarBulk: FC<SidebarBulkProps> = ({
  selectedBulkValue,
  feesOnMaxDuration,
  isMaxReturnPeriodDays,
  onClick,
  onBack,
  onSubmit,
  feeOnDay,
}) => {
  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  return (
    <>
      <div className={styles.sidebar}>
        <p className={styles.title}>Borrowing info</p>
        <div className={styles.feesWrapper}>
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 1</p>
            <p className={styles.value}>
              {feeOnDay.toFixed(3)}
              <Solana />
            </p>
          </div>
          <div className={styles.feesRow}>
            <p className={styles.subtitle}>Fee on day 7</p>
            <p className={styles.value}>
              {(feeOnDay * 7).toFixed(3)} <Solana />
            </p>
          </div>
          {isMaxReturnPeriodDays && (
            <div className={styles.feesRow}>
              <p className={styles.subtitle}>Fee on day 14</p>
              <p className={styles.value}>
                {(feesOnMaxDuration * 14).toFixed(3)}
                <Solana />
              </p>
            </div>
          )}
        </div>
        <div className={styles.sidebarBtnWrapper}>
          <Button
            type="secondary"
            onClick={openConfirmModal}
            className={styles.btn}
          >
            Borrow {selectedBulkValue?.toFixed(2)} SOL
          </Button>
          <Button onClick={onBack ? onBack : onClick} className={styles.btn}>
            Change assets
          </Button>
        </div>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={onSubmit}
        title="Please confirm"
        subtitle={`You are about to confirm the transaction to borrow bulk loan.
          Want to proceed?
        `}
        btnAgree="Let's go"
      />
    </>
  );
};

export default SidebarBulk;
