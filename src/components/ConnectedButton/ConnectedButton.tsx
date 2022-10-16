import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';
import styles from './styles.module.scss';
import { ArrowDownBtn } from '../../icons';
import { Bell } from '../../iconsNew/Bell';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectedButton: FC<ConnectButtonProps> = () => {
  const dispatch = useDispatch();
  const { publicKey: walletPubKey } = useWallet();

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      <div className={styles.icon}>
        <Bell />
      </div>
      <div className={styles.text}>
        {shortenAddress(walletPubKey.toString())}
        <ArrowDownBtn className={styles.arrowDownIcon} />
      </div>
    </div>
  );
};

export default ConnectedButton;
