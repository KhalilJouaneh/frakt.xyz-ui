import { FC, useState } from 'react';

import { Modal } from '@frakt/components/Modal';
import { Button } from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { CloseModal } from '@frakt/icons';
import { TokenFieldWithBalance } from '@frakt/components/TokenField';

import styles from './ExitModal.module.scss';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';

interface ExitModalProps {
  visible: boolean;
  onCancel: () => void;
  onExit: () => void;
  availableToExit: number;
}

export const ExitModal: FC<ExitModalProps> = ({
  visible,
  onCancel,
  onExit,
  availableToExit,
}) => {
  const [exitValue, setExitValue] = useState('');
  const [percentExitValue, setPercentExitValue] = useState(0);

  const onExitValueChange = (nextValue: string) => {
    setExitValue(nextValue);
    const percent = calcPercentByValue(nextValue, availableToExit);
    setPercentExitValue(percent);
  };

  const onExitPercentChange = (nextPercent: number) => {
    const exitValue = calcValueByPercent(nextPercent, availableToExit);
    setExitValue(exitValue);
    setPercentExitValue(nextPercent);
  };

  const calcPercentByValue = (value: string, max: number) => {
    const percentOfBalance = (parseFloat(value) / Number(max)) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      return percentOfBalance;
    }
    if (percentOfBalance > 100) {
      return 100;
    }
    return 0;
  };

  const calcValueByPercent = (percent: number, max: number): string => {
    const value = (percent * Number(max)) / 100;
    return value ? value?.toFixed(2) : '0';
  };

  const notEnoughValueError = availableToExit < Number(exitValue);

  const isDisabledWithdrawBtn = Number(exitValue) === 0 || notEnoughValueError;

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
      <div className={styles.closeIcon} onClick={onCancel}>
        <CloseModal />
      </div>
      <div className={styles.content}>
        <TokenFieldWithBalance
          value={exitValue}
          onValueChange={onExitValueChange}
          currentToken={SOL_TOKEN}
          label="Available to exit:"
          lpBalance={availableToExit}
          error={notEnoughValueError}
          className={styles.input}
          showMaxButton
          labelRight
        />
        <div className={styles.errors}>
          {notEnoughValueError && <p>Not enough SOL</p>}
        </div>
        <Slider
          value={percentExitValue}
          setValue={availableToExit && onExitPercentChange}
          className={styles.slider}
          marks={SLIDER_MARKS}
          withTooltip
          step={1}
        />
        <Button
          onClick={onExit}
          className={styles.btn}
          type="secondary"
          disabled={isDisabledWithdrawBtn}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

const SLIDER_MARKS: { [key: number]: string | JSX.Element } = {
  0: '0 %',
  25: '25 %',
  50: '50 %',
  75: '75 %',
  100: '100 %',
};
