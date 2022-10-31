import { FC, useEffect, useState } from 'react';
import cx from 'classnames';

import { TabsNames, useDepositTxn, usePoolModal } from './usePoolModal';
import RiskTabs, { RiskTabsNames } from './RiskTabs';
import SwapForm from '../../componentsNew/SwapModal';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import DepositHigh from './DepositHigh';
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
  const { withdrawValue, depositValue, poolTabs, tabValue, setTabValue } =
    usePoolModal({ visible, depositAmount });

  const { depositLiquidity, unstakeLiquidity } = useDepositTxn({
    liquidityPoolPubkey,
    depositValue,
    withdrawValue,
    onCancel,
  });

  const [riskTabType, setRiskTabType] = useState<RiskTabsNames>(
    RiskTabsNames.MEDIUM,
  );

  const [mobileVisible, setMobileVisible] = useState<boolean>(false);

  useEffect(() => {
    setMobileVisible(false);
  }, [visible]);

  return (
    <Modal
      visible={!!visible}
      centered
      onCancel={onCancel}
      width={716}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>
      <div className={cx(styles.wrapper, mobileVisible && styles.mobileModal)}>
        <RiskTabs
          onClick={setRiskTabType}
          type={riskTabType}
          className={styles.tabs}
        />
        <div className={styles.poolTabs}>
          <Tabs tabs={poolTabs} value={tabValue} setValue={setTabValue} />
          <div className={styles.content}>
            {tabValue === TabsNames.DEPOSIT &&
              riskTabType === RiskTabsNames.HIGH && (
                <DepositHigh
                  depositAmount={depositAmount}
                  utilizationRate={utilizationRate}
                  onSubmit={depositLiquidity}
                  apr={apr}
                />
              )}
            {tabValue === TabsNames.DEPOSIT &&
              riskTabType === RiskTabsNames.MEDIUM && (
                <DepositTab
                  depositAmount={depositAmount}
                  utilizationRate={utilizationRate}
                  onSubmit={depositLiquidity}
                  apr={apr}
                />
              )}
            {tabValue === TabsNames.SWAP && <SwapForm />}
            {tabValue === TabsNames.WITHDRAW && (
              <WithdrawTab
                onSubmit={unstakeLiquidity}
                depositAmount={depositAmount}
              />
            )}
          </div>
        </div>
      </div>
      {!mobileVisible && (
        <div className={styles.mobileWrapper}>
          <RiskTabs
            setMobileVisible={setMobileVisible}
            onClick={setRiskTabType}
            type={riskTabType}
          />
        </div>
      )}
    </Modal>
  );
};
