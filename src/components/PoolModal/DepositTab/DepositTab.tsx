import { FC } from 'react';

import { marks, usePoolModal, useDepositTxn } from '../hooks';
import { sendAmplitudeData } from '../../../utils/amplitude';
import { TokenFieldWithBalance } from '../../TokenField';
import styles from './DepositTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import Button from '../../Button';

interface DepositTabProps {
  utilizationRate: number;
  onCancel: () => void;
  apr: number;
  depositAmount: number;
  liquidityPoolPubkey: string;
}

const DepositTab: FC<DepositTabProps> = ({
  utilizationRate,
  apr,
  depositAmount,
  liquidityPoolPubkey,
  onCancel,
}) => {
  const {
    depositValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    solWalletBalance,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { depositLiquidity } = useDepositTxn({
    liquidityPoolPubkey,
    depositValue,
    onCancel,
    onClearDepositValue,
  });

  const solWalletBalanceNumber = parseFloat(solWalletBalance.toFixed(2));
  const depositValueNumber = parseFloat(depositValue) || 0;

  const notEnoughBalanceError = solWalletBalanceNumber < depositValueNumber;

  const isDisabledDepositBtn =
    depositValueNumber === 0 || notEnoughBalanceError;

  return (
    <div className={styles.wrapper}>
      <div>
        <TokenFieldWithBalance
          className={styles.input}
          value={depositValue}
          onValueChange={onDepositValueChange}
          currentToken={SOL_TOKEN}
          label={`BALANCE:`}
          lpBalance={solWalletBalanceNumber}
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
      </div>
      <div>
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
    </div>
  );
};

export default DepositTab;
