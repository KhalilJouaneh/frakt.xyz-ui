import { FC } from 'react';

import { TokenFieldWithBalance } from '../../TokenField';
import { marks, usePoolModal } from '../usePoolModal';
import styles from './WithdrawTab.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Slider } from '../../Slider';
import Button from '../../Button';

interface WithdrawTabProps {
  onSubmit: () => void;
  depositAmount: number;
}

const WithdrawTab: FC<WithdrawTabProps> = ({ onSubmit, depositAmount }) => {
  const {
    withdrawValue,
    percentValue,
    onWithdrawValueChange,
    onWithdrawPercentChange,
  } = usePoolModal({ depositAmount });

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
        onClick={onSubmit}
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
