import { FC } from 'react';

import { sendAmplitudeData } from '../../../utils/amplitude';
import { TokenFieldWithBalance } from '../../TokenField';
import { marks, usePoolModal } from '../usePoolModal';
import styles from './DepositHigh.module.scss';
import { SOL_TOKEN } from '../../../utils';
import { Select } from '../../Select';
import { Slider } from '../../Slider';
import Button from '../../Button';
import { useSelect } from '../../Select/hooks';

interface DepositHighProps {
  utilizationRate: number;
  onSubmit: () => void;
  apr: number;
  depositAmount: number;
}
const DepositHigh: FC<DepositHighProps> = ({
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

  const durationOptions = [
    { label: '7 Days', value: '7' },
    { label: '14 Days', value: '14' },
  ];

  const rawdepositAmountWithFee = Number(solWalletBalance) - 0.02;

  const notEnoughBalanceError = Number(solWalletBalance) < Number(depositValue);

  const isDisabledDepositBtn =
    Number(depositValue) === 0 || notEnoughBalanceError;

  const depositAmountWithFee =
    rawdepositAmountWithFee < 0 ? 0 : rawdepositAmountWithFee;

  const {
    options: selectOptions,
    value: selectValue,
    setValue: setSelectValue,
  } = useSelect({
    options: durationOptions,
    defaultValue: durationOptions[0].value,
  });

  return (
    <div className={styles.wrapper}>
      <div>
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
        <div className={styles.selectWrapper}>
          <div className={styles.selectContent}>
            <p className={styles.selectLabel}>Loans Duration</p>
            <Select
              className={styles.select}
              options={selectOptions}
              value={selectValue}
              onChange={({ value }) => setSelectValue(value)}
              defaultValue={selectOptions[0]}
            />
          </div>
        </div>
        <TokenFieldWithBalance
          className={styles.input}
          value={depositValue}
          onValueChange={onDepositValueChange}
          currentToken={SOL_TOKEN}
          label={`Deposit fee:`}
          error={notEnoughBalanceError}
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
            onSubmit();
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

export default DepositHigh;
