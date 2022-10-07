import { FC } from 'react';

import { marks, TabsNames, usePoolModal } from './usePoolModal';
import { TokenFieldWithBalance } from '../TokenField';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import { SOL_TOKEN } from '../../utils';
import { Slider } from '../Slider';
import { Modal } from '../Modal';
import Button from '../Button';
import { Tabs } from '../Tabs';
import { sendAmplitudeData } from '../../utils/amplitude';

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
  const {
    withdrawValue,
    depositValue,
    depositLiquidity,
    unstakeLiquidity,
    poolTabs,
    tabValue,
    setTabValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    solWalletBalance,
  } = usePoolModal(liquidityPoolPubkey, visible, depositAmount, onCancel);

  const rawdepositAmountWithFee = Number(solWalletBalance) - 0.02;
  const notEnoughDepositError = depositAmount < Number(withdrawValue);
  const notEnoughBalanceError = Number(solWalletBalance) < Number(depositValue);
  const isDisabledDepositBtn =
    Number(depositValue) === 0 || notEnoughBalanceError;
  const isDisabledWithdrawBtn =
    Number(withdrawValue) === 0 || notEnoughDepositError;

  const depositAmountWithFee =
    rawdepositAmountWithFee < 0 ? 0 : rawdepositAmountWithFee;

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
      <Tabs tabs={poolTabs} value={tabValue} setValue={setTabValue} />
      {tabValue === TabsNames.DEPOSIT && (
        <div className={styles.content}>
          <TokenFieldWithBalance
            className={styles.input}
            value={depositValue}
            onValueChange={onDepositValueChange}
            currentToken={SOL_TOKEN}
            label={`BALANCE:`}
            lpBalance={Number(depositAmountWithFee.toFixed(2))}
            error={notEnoughBalanceError}
            showMaxButton
            labelRight
          />
          <div className={styles.errors}>
            {notEnoughBalanceError && <p>Not enough SOL</p>}
          </div>
          <Slider
            value={percentValue}
            setValue={solWalletBalance && onDepositPercentChange}
            className={styles.slider}
            marks={marks}
            withTooltip
            step={1}
          />
          <div className={styles.info}>
            <span className={styles.infoTitle}>Deposit yield</span>
            <span className={styles.infoValue}>{apr.toFixed(2)} %</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Utilization rate</span>
            <span className={styles.infoValue}>
              {(utilizationRate || 0).toFixed(2)} %
            </span>
          </div>
          <Button
            onClick={() => {
              depositLiquidity();
              sendAmplitudeData('loans-confirm-deposit');
            }}
            className={styles.btn}
            type="secondary"
            disabled={isDisabledDepositBtn}
          >
            Deposit
          </Button>
        </div>
      )}
      {tabValue === TabsNames.WITHDRAW && (
        <div className={styles.content}>
          <TokenFieldWithBalance
            value={withdrawValue}
            onValueChange={onWithdrawValueChange}
            currentToken={SOL_TOKEN}
            label={`Your deposit:`}
            lpBalance={depositAmount}
            error={notEnoughDepositError}
            className={styles.input}
            showMaxButton
            labelRight
          />
          <div className={styles.errors}>
            {notEnoughDepositError && <p>Not enough SOL</p>}
          </div>
          <Slider
            value={percentValue}
            setValue={depositAmount && onWithdrawPercentChange}
            className={styles.slider}
            marks={marks}
            withTooltip
            step={1}
          />

          <Button
            onClick={unstakeLiquidity}
            className={styles.btn}
            type="secondary"
            disabled={isDisabledWithdrawBtn}
          >
            Confirm
          </Button>
        </div>
      )}
    </Modal>
  );
};
