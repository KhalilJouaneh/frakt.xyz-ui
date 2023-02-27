import { FC } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import Button from '../../components/Button';
import styles from './styles.module.scss';

interface ConnectWalletSectionProps {
  text: string;
  className?: string;
}

export const ConnectWalletSection: FC<ConnectWalletSectionProps> = ({
  text,
  className,
}) => {
  const dispatch = useDispatch();

  return (
    <div className={classNames(styles.connectWallet, className)}>
      <p className={styles.connectWalletText}>{text}</p>
      <Button
        type="secondary"
        className={styles.connectWalletBtn}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};
