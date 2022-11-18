import { FC } from 'react';

import { TabsNames, usePoolModal } from './usePoolModal';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import WithdrawTab from './WithdrawTab';
import DepositTab from './DepositTab';
import { Tabs } from '../Tabs';
import { Modal } from '../Modal';

interface PoolModalProps {
  visible: string;
  onCancel: () => void;
  apr: number;
  depositAmount: number;
  utilizationRate: number;
  liquidityPoolPubkey: string;
}

export const PoolModal: FC<PoolModalProps> = ({
  visible,
  onCancel,
  apr,
  depositAmount = 0,
  utilizationRate,
  liquidityPoolPubkey,
}) => {
  const { poolTabs, tabValue, setTabValue } = usePoolModal({
    visible,
    depositAmount,
  });

  return (
    <Modal
      visible={!!visible}
      centered
      onCancel={onCancel}
      width={500}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>

      <Tabs
        className={styles.tabs}
        tabs={poolTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <div className={styles.content}>
        {tabValue === TabsNames.DEPOSIT && (
          <DepositTab
            liquidityPoolPubkey={liquidityPoolPubkey}
            utilizationRate={utilizationRate}
            depositAmount={depositAmount}
            onCancel={onCancel}
            apr={apr}
          />
        )}
        {tabValue === TabsNames.WITHDRAW && (
          <WithdrawTab
            liquidityPoolPubkey={liquidityPoolPubkey}
            onCancel={onCancel}
            depositAmount={depositAmount}
          />
        )}
      </div>
    </Modal>
  );
};
