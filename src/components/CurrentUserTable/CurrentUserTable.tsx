import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { sum, filter, map } from 'ramda';

import { UserAvatar } from '@frakt/components/UserAvatar';
import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { Solana, FRKT, Copy, SignOut, ChangeWallet } from '@frakt/icons';
import { copyToClipboard } from '../../utils';
import { setAmplitudeUserId } from '../../utils/amplitude';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../utils/accounts/useNativeAccount';
import { networkRequest } from '../../utils/state';
import { WalletsItems } from '../WalletContent/WalletContent';
import { useUserInfo } from '@frakt/hooks';

interface CurrentUserTableProps {
  className?: string;
}

interface UsersRewards {
  lenders?: [{ user: string; reward: number }];
  borrowers?: [{ user: string; reward: number }];
}

const CurrentUserTable = ({
  className = '',
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const [usersRewards, setUsersRewars] = useState<UsersRewards>(null);
  const { data: userData } = useUserInfo();

  if (!publicKey) {
    return null;
  }

  useEffect(() => {
    (async () => {
      const data = await networkRequest({
        url: `${process.env.REWARDS_ENDPOINT}/${publicKey?.toBase58()}`,
      });

      setUsersRewars(data);
    })();
  }, []);

  const getRewardsValue = () => {
    const publicKeyString = publicKey.toBase58();
    const currentUser = ({ user }) => user === publicKeyString;
    const reward = ({ reward }) => reward;

    if (usersRewards) {
      const { lenders, borrowers } = usersRewards;

      const allUsersRewards = [...lenders, ...borrowers];

      const userRewards = filter(currentUser, allUsersRewards);
      const valueUserRewards = sum(map(reward, userRewards)) || 0;

      return valueUserRewards.toFixed(2);
    }
  };

  const [visibleWalletItems, setVisibleWalletItems] = useState<boolean>(false);

  useEffect(() => {
    setAmplitudeUserId(publicKey?.toBase58());
  }, [publicKey]);

  const getBalanceValue = () => {
    const valueStr = `${formatNumber.format(
      (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
    )}`;

    return (
      <div className={styles.column}>
        <p className={styles.columnTitle}>Balance</p>
        <p className={styles.columnValue}>
          {valueStr} <Solana />
        </p>
      </div>
    );
  };

  return (
    <>
      {!visibleWalletItems ? (
        <div className={`${className} ${styles.wrapper}`}>
          <div className={styles.userWrapper}>
            <UserAvatar
              className={styles.avatar}
              imageUrl={userData?.avatarUrl}
            />
            <div className={styles.userInfo}>
              <div
                className={styles.walletInfo}
                onClick={() => copyToClipboard(publicKey?.toBase58())}
              >
                <p className={styles.address}>
                  {shortenAddress(`${publicKey || ''}`)}
                </p>
                <Copy />
              </div>
            </div>
          </div>
          <div className={styles.balanceInfo}>
            {getBalanceValue()}
            <div className={styles.column}>
              <p className={styles.columnTitle}>Rewards</p>
              <p className={styles.columnValue}>
                {getRewardsValue() || '--'} <FRKT />
              </p>
            </div>
          </div>

          <div className={styles.separator} />

          <div className={styles.btnWrapperRow}>
            <div
              className={styles.btnWrapper}
              onClick={() => setVisibleWalletItems(true)}
            >
              <ChangeWallet />
              Change wallet
            </div>
            <div className={styles.btnWrapper} onClick={disconnect}>
              <SignOut />
              Sign out
            </div>
          </div>
        </div>
      ) : (
        <WalletsItems />
      )}
    </>
  );
};

export default CurrentUserTable;
