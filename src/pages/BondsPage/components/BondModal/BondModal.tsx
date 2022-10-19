import { FC, useState } from 'react';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';
import { Controller } from 'react-hook-form';

import { Modal } from '../../../../components/Modal';
import { TokenFieldWithBalance } from '../../../../components/TokenField';
import ChangeSidesButton from '../ChangeSidesButton';
import styles from './BondModal.module.scss';
import { InputControlsNames, useBondModal } from './hooks';
import { SolanaIcon } from '../../../../icons';
import Button from '../../../../components/Button';
import SettingsModal from './SettingsModal';

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

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      width={500}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.bondInfoWrapper}>
        <div className={styles.bondInfo}>
          <p className={styles.bondInfoValue}>
            0.5 <SolanaIcon />
          </p>
          <p className={styles.bondInfoTitle}>Bond price</p>
        </div>
        <div className={styles.bondInfo}>
          <p className={styles.bondInfoValue}>
            0.8 <SolanaIcon />
          </p>
          <p className={styles.bondInfoTitle}>Market price</p>
        </div>
        <div className={styles.bondInfo}>
          <p className={styles.bondInfoValue}>60 %</p>
          <p className={styles.bondInfoTitle}>Roi</p>
        </div>
      </div>

      <SettingsModal slippage={slippage} setSlippage={setSlippage} />
      <Controller
        control={control}
        name={InputControlsNames.PAY_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            value={value}
            onValueChange={onChange}
            tokensList={[SOL_TOKEN]}
            currentToken={payToken}
            modalTitle="Pay"
            label="Pay"
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
            value={value}
            onValueChange={onChange}
            currentToken={receiveToken}
            tokensList={[SOL_TOKEN]}
            modalTitle="Receive"
            label="Receive"
            disabled
          />
        )}
      />
      <Button className={styles.btn} type="secondary">
        Swap
      </Button>
    </Modal>
  );
};

export default BondModal;
