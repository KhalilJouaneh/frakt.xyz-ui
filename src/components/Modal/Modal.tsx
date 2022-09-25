import {
  Modal as ModalAnt,
  ModalFuncProps,
  ModalProps as ModalAntProps,
} from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { CloseModalIcon } from '../../iconsNew/Close';

export interface ModalProps extends ModalAntProps {
  className?: string;
  children?: any;
}

export interface ModalConfirmProps extends ModalFuncProps {
  className?: string;
}

export const ConfirmModal = (
  props: ModalConfirmProps,
): { update: any; destroy: any } =>
  ModalAnt.confirm({
    className: classNames(styles.modal, props.className),
    closeIcon: <CloseModalIcon className={styles.close} />,
    okButtonProps: { className: styles.okButton },
    cancelButtonProps: { className: styles.cancelButton },
    content: props.content,
    ...props,
  });

export const Modal = ({
  children,
  footer = null,
  className,
  ...props
}: ModalProps): JSX.Element => {
  return (
    <ModalAnt
      {...props}
      footer={footer}
      transitionName={null}
      className={classNames(styles.modal, className)}
      wrapClassName={styles.wrap}
      closeIcon={<CloseModalIcon className={styles.close} />}
    >
      {children}
    </ModalAnt>
  );
};
