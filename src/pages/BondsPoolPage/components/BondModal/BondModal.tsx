import { FC } from 'react';

import { CloseModalIcon, SolanaIcon } from '../../../../icons';
import SwapForm from '../../../../componentsNew/SwapModal';
import { Modal } from '../../../../components/Modal';
import styles from './BondModal.module.scss';

interface BondModalProps {
  visible: boolean;
  onCancel: () => void;
  bondPrice?: number;
  roiPercent?: number;
  marketPrice?: string;
}

const BondModal: FC<BondModalProps> = ({ visible, onCancel }) => {
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
      <SwapForm />
    </Modal>
  );
};

export default BondModal;
