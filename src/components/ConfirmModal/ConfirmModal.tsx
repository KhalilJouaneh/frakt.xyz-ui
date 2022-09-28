import { FC } from 'react';

import styles from './styles.module.scss';
import { Modal } from '../Modal';
import Button from '../Button';
import { sendAmplitudeData } from '../../utils/amplitude';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  subtitle: string;
  btnAgree?: string;
  btnCancel?: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  visible,
  onCancel,
  title = 'Please confirm',
  subtitle,
  onSubmit,
  btnAgree = 'I agree',
  btnCancel = 'Cancel',
}) => {
  return (
    <Modal
      className={styles.modal}
      visible={visible}
      closable={true}
      onCancel={onCancel}
      width={400}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.btnWrapper}>
          <Button
            type="secondary"
            className={styles.btn}
            onClick={() => {
              onSubmit();
              sendAmplitudeData('loans-confirm-borrow');
            }}
          >
            {btnAgree}
          </Button>
          <Button className={styles.btn} onClick={onCancel}>
            {btnCancel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
