import { FC } from 'react';

import {
  riskTabs,
  TabsNames,
  useDepositTxn,
  usePoolModal,
} from './usePoolModal';
import SwapForm from '../../componentsNew/SwapModal';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import WithdrawTab from './WithdrawTab';
import DepositTab from './DepositTab';
import { Tabs } from '../Tabs';
import { Modal } from '../Modal';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
      <div className={styles.wrapper}>
        <div className={styles.riskTabs}>
          <div className={styles.riskTab}>
            <p className={styles.riskTabTitle}>Medium Risk</p>
            <div className={styles.riskTabInfoWrapper}>
              <p className={styles.riskTabInfo}>
                Deposit yield
                <Tooltip
                  placement="top"
                  trigger="hover"
                  overlay="The maximum difference between your estimated price and execution price."
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </p>
              <p className={styles.riskTabValue}>28 %</p>
            </div>
            <div className={styles.riskTabInfoWrapper}>
              <p className={styles.riskTabTitle}>Your deposit</p>
              <p className={styles.riskTabValue}>123,023.32 SOL</p>
            </div>
          </div>
          <div className={styles.riskTab}>
            <p className={styles.riskTabTitle}>High Risk</p>
            <div className={styles.riskTabInfoWrapper}>
              <p className={styles.riskTabInfo}>
                Deposti yield
                <Tooltip
                  placement="top"
                  trigger="hover"
                  overlay="The maximum difference between your estimated price and execution price."
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </p>
              <p className={styles.riskTabValue}>28 %</p>
            </div>
            <div className={styles.riskTabInfoWrapper}>
              <p className={styles.riskTabInfo}>Your Deposit</p>
              <p className={styles.riskTabValue}>123,023.32 SOL</p>
            </div>
          </div>
        </div>
        <div>
          <Tabs tabs={poolTabs} value={tabValue} setValue={setTabValue} />
          <div className={styles.content}>
            {tabValue === TabsNames.DEPOSIT && (
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
    </Modal>
  );
};
