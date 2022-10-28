import { FC, useState } from 'react';

import { sendAmplitudeData } from '../../../utils/amplitude';
import { TokenFieldWithBalance } from '../../TokenField';
import { marks, usePoolModal } from '../usePoolModal';
import styles from './DepositTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import BondMode from '../BondMode';
import Button from '../../Button';

interface DepositTabProps {
  utilizationRate: number;
  onSubmit: () => void;
  apr: number;
  depositAmount: number;
}

const DepositTab: FC<DepositTabProps> = ({
  utilizationRate,
  onSubmit,
  apr,
  depositAmount,
}) => {
  const {
    depositValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    solWalletBalance,
  } = usePoolModal({ depositAmount });

  const rawdepositAmountWithFee = Number(solWalletBalance) - 0.02;

  const notEnoughBalanceError = Number(solWalletBalance) < Number(depositValue);

  const isDisabledDepositBtn =
    Number(depositValue) === 0 || notEnoughBalanceError;

  const depositAmountWithFee =
    rawdepositAmountWithFee < 0 ? 0 : rawdepositAmountWithFee;

  const [isBoundMode, setIsBoundMode] = useState<boolean>(false);

  return (
    <>
      <BondMode
        value={isBoundMode}
        onChange={() => setIsBoundMode(!isBoundMode)}
      />
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
          onSubmit();
          sendAmplitudeData('loans-confirm-deposit');
        }}
        className={styles.btn}
        type="secondary"
        disabled={isDisabledDepositBtn}
      >
        Deposit
      </Button>
    </>
  );
};

export default DepositTab;
