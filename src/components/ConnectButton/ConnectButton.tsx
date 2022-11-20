import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';
import styles from './ConnectButton.module.scss';
import { ArrowDownBtn } from '../../icons';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const dispatch = useDispatch();
  const { publicKey: walletPubKey, connected } = useWallet();

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      {connected && (
        <>
          {shortenAddress(walletPubKey.toString())}
          <ArrowDownBtn className={styles.arrowDownIcon} />
        </>
      )}
      {!connected && 'Connect Wallet'}
    </div>
  );
};

export default ConnectButton;
