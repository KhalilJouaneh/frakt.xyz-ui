import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { UserAvatar } from '@frakt/components/UserAvatar';
import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';
import styles from './ConnectButton.module.scss';
import { ArrowDownBtn } from '../../icons';
import { useUserInfo } from '@frakt/hooks';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const dispatch = useDispatch();
  const { publicKey: walletPubKey, connected } = useWallet();

  const { data } = useUserInfo();

  return (
    <button
      className={styles.container}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      {connected && (
        <>
          <UserAvatar className={styles.avatar} imageUrl={data?.avatarUrl} />
          {shortenAddress(walletPubKey.toString())}
          <ArrowDownBtn className={styles.arrowDownIcon} />
        </>
      )}
      {!connected && 'Connect Wallet'}
    </button>
  );
};

export default ConnectButton;
