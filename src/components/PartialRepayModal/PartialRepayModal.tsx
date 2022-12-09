import { BN } from '@frakt-protocol/frakt-sdk';
import { FC, useState } from 'react';

import Button from '../Button';
import { Modal } from '../Modal';
import { Slider } from '../Slider';
import { CloseModalIcon, SolanaIcon } from '../../icons';
import { Loan } from '../../state/loans/types';
import { SOL_TOKEN } from '../../utils';
import { useNativeAccount } from '../../utils/accounts';
import styles from './PartialRepayModal.module.scss';

interface PartialRepayModalProps {
  visible: boolean;
  onCancel: () => void;
  onPartialPayback: (paybackAmount: BN, partialPercent?: number) => void;
  loan: Loan;
}

const SLIDER_MARKS = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

const getRemainingDebt = (paybackAmount: string, totalDebt: number) => {
  const paybackAmountNumber = parseFloat(paybackAmount);
  const remainingDebt = totalDebt - paybackAmountNumber;
  return remainingDebt <= 0 ? '0' : remainingDebt?.toFixed(2);
};

export const PartialRepayModal: FC<PartialRepayModalProps> = ({
  visible,
  onCancel,
  loan,
  onPartialPayback,
}) => {
  const { account } = useNativeAccount();

  const [partialPercent, setPartialPercent] = useState(100);
  const [paybackAmount, setPaybackAmount] = useState<string>(
    loan?.repayValue?.toFixed(3) || '0',
  );

  const onPartialPercentChange = (nextValue: number) => {
    setPartialPercent(nextValue);

    setPaybackAmount(((loan?.repayValue * nextValue) / 100)?.toFixed(3));
  };

  // const onPaybackAmountChange = (nextValue: string) => {
  //   const nextValueNumber = parseFloat(nextValue);
  //   setPaybackAmount(nextValue);
  //   setPartialPercent((nextValueNumber / loan?.repayValue) * 100);
  // };

  const onSubmit = () => {
    //? Prevent rounding problems
    const paybackAmountBN =
      partialPercent > 98
        ? new BN(0) //? 0 === Repay all
        : new BN(parseFloat(paybackAmount) * 10 ** SOL_TOKEN.decimals);

    onPartialPayback(paybackAmountBN, partialPercent);
  };

  const notEnoughBalanceError =
    account?.lamports < parseFloat(paybackAmount) * 10 ** SOL_TOKEN.decimals;

  const invalidValueError = parseFloat(paybackAmount) > loan?.repayValue;

  const remainingDebt = getRemainingDebt(paybackAmount, loan?.repayValue);

  const repayValue = Math.abs(loan?.repayValue - Number(remainingDebt) || 0);

  const submitDisabled =
    parseFloat(paybackAmount) <= 0 ||
    notEnoughBalanceError ||
    invalidValueError;

  return (
    <Modal
      visible={!!visible}
      centered
      onCancel={onCancel}
      width={500}
      destroyOnClose
      footer={false}
      closable={false}
    >
      <div className={styles.closeModal} onClick={onCancel}>
        <CloseModalIcon className={styles.closeIcon} />
      </div>

      <div className={styles.lable}>
        <p>Debt:</p> <span>{loan?.repayValue?.toFixed(2)} SOL</span>
      </div>

      <Slider
        value={partialPercent}
        setValue={onPartialPercentChange}
        className={styles.slider}
        marks={SLIDER_MARKS}
        withTooltip
        step={1}
      />
      <div className={styles.info}>
        <span className={styles.infoTitle}>Repay value</span>
        <span className={styles.infoValue}>
          {repayValue?.toFixed(2)}
          <SolanaIcon />
        </span>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Remaining debt</span>
        <span className={styles.infoValue}>
          {remainingDebt} <SolanaIcon />
        </span>
      </div>
      <Button
        onClick={onSubmit}
        className={styles.repayBtn}
        type="secondary"
        disabled={submitDisabled}
      >
        Repay {remainingDebt === '0' ? 'all' : repayValue?.toFixed(2)}
      </Button>
    </Modal>
  );
};
