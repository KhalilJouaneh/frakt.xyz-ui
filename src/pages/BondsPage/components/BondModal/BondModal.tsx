import { FC } from 'react';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';
import { Controller } from 'react-hook-form';

import { Modal } from '../../../../components/Modal';
import { TokenFieldWithBalance } from '../../../../components/TokenField';
import ChangeSidesButton from '../ChangeSidesButton';
import styles from './BondModal.module.scss';
import { InputControlsNames, useBondModal } from './hooks';
import { CloseModalIcon, SolanaIcon } from '../../../../icons';
import Button from '../../../../components/Button';
import SettingsModal from './SettingsModal';
import {
  getSolBalanceValue,
  getCorrectSolWalletBalance,
} from '../../../../utils';
import { useNativeAccount } from '../../../../utils/accounts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '../../../../components/Tooltip';

interface BondModalProps {
  visible: boolean;
  onCancel: () => void;
  bondPrice?: number;
  roiPercent?: number;
  marketPrice?: string;
}

const BondModal: FC<BondModalProps> = ({ visible, onCancel }) => {
  const {
    control,
    payToken,
    receiveToken,
    slippage,
    setSlippage,
    changeSides,
  } = useBondModal();

  const { account } = useNativeAccount();
  const solBalanceValue = getSolBalanceValue(account);
  const solWalletBalance = getCorrectSolWalletBalance(solBalanceValue);

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      width={512}
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
        <div className={styles.content}>
          <p className={styles.value}>
            0.5 <SolanaIcon />
          </p>
          <p className={styles.title}>Bond price</p>
        </div>
        <div className={styles.content}>
          <p className={styles.value}>
            0.8 <SolanaIcon />
          </p>
          <p className={styles.title}>Market price</p>
        </div>
        <div className={styles.content}>
          <p className={styles.value}>60 %</p>
          <p className={styles.title}>Roi</p>
        </div>
      </div>

      <SettingsModal slippage={slippage} setSlippage={setSlippage} />
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
    </Modal>
  );
};

export default BondModal;
