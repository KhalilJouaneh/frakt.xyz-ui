import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';
import { Controller } from 'react-hook-form';

import { getSolBalanceValue, getCorrectSolWalletBalance } from '../../utils';
import { TokenFieldWithBalance } from '../../components/TokenField';
import { InputControlsNames, useSwapForm } from './hooks';
import { useNativeAccount } from '../../utils/accounts';
import ChangeSidesButton from './ChangeSidesButton';
import Tooltip from '../../components/Tooltip';
import SlippageModal from '../SlippageModal';
import styles from './SwapForm.module.scss';
import Button from '../../components/Button';

const SwapForm: FC = () => {
  const {
    control,
    payToken,
    receiveToken,
    slippage,
    setSlippage,
    changeSides,
  } = useSwapForm();

  const { account } = useNativeAccount();
  const solBalanceValue = getSolBalanceValue(account);
  const solWalletBalance = getCorrectSolWalletBalance(solBalanceValue);

  return (
    <>
      <SlippageModal slippage={slippage} setSlippage={setSlippage} />
      <Controller
        control={control}
        name={InputControlsNames.PAY_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            className={styles.input}
            value={value}
            onValueChange={onChange}
            tokensList={[SOL_TOKEN]}
            currentToken={payToken}
            label="Pay"
            lpBalance={Number(solWalletBalance)}
            showMaxButton
          />
        )}
      />
      <ChangeSidesButton onClick={changeSides} />
      <Controller
        control={control}
        name={InputControlsNames.RECEIVE_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            className={styles.input}
            value={value}
            onValueChange={onChange}
            currentToken={receiveToken}
            tokensList={[SOL_TOKEN]}
            label="Receive"
            disabled
          />
        )}
      />
      <div className={styles.infoWrapper}>
        <div className={styles.info}>
          <span className={styles.infoTitle}>
            Slippage Tolerance
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="The maximum difference between your estimated price and execution price."
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </span>
          <span className={styles.infoValue}>{`${slippage}%`}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoTitle}>
            Minimum Received
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="The least amount of tokens you will recieve on this trade"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </span>
          <span className={styles.infoValue}>22 $SMB</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoTitle}>
            Price Impact
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="The difference between the market price and estimated price due to trade size"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </span>
          <span className={styles.infoValue}>100.00 %</span>
        </div>
      </div>
      <Button className={styles.btn} type="secondary">
        Swap
      </Button>
    </>
  );
};

export default SwapForm;
