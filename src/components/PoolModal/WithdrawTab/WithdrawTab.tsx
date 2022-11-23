import { FC } from 'react';

import { marks, useDepositTxn, usePoolModal } from '../hooks';
import { TokenFieldWithBalance } from '../../TokenField';
import styles from './WithdrawTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import Button from '../../Button';

interface WithdrawTabProps {
  depositAmount: number;
  liquidityPoolPubkey: string;
  onCancel: () => void;
}

const WithdrawTab: FC<WithdrawTabProps> = ({
  depositAmount,
  liquidityPoolPubkey,
  onCancel,
}) => {
  const {
    withdrawValue,
    percentValue,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    onClearDepositValue,
  } = usePoolModal({ depositAmount });

  const { unstakeLiquidity } = useDepositTxn({
    onClearDepositValue,
    liquidityPoolPubkey,
    withdrawValue,
    onCancel,
  });

  const notEnoughDepositError = depositAmount < Number(withdrawValue);

  const isDisabledWithdrawBtn =
    Number(withdrawValue) === 0 || notEnoughDepositError;

  return (
    <>
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
    </>
  );
};

export default WithdrawTab;
