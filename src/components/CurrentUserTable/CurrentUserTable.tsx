import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { sum, filter, map } from 'ramda';

import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { SolanaIcon, UserIcon } from '../../icons';

import { getDiscordUri, getDiscordAvatarUrl } from '../../utils';
import { PATHS } from '../../constants';
import { LinkWithArrow } from '../LinkWithArrow';
import { UserState } from '../../state/common/types';
import DiscordIcon from '../../icons/DiscordIcon2';
import { sendAmplitudeData, setAmplitudeUserId } from '../../utils/amplitude';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../utils/accounts/useNativeAccount';
import { networkRequest } from '../../utils/state';

interface CurrentUserTableProps {
  className?: string;
  user?: UserState;
}

interface UsersRewards {
  lenders?: [{ user: string; reward: number }];
  borrowers?: [{ user: string; reward: number }];
}

const CurrentUserTable = ({
  className = '',
  user = null,
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const avatarUrl = getDiscordAvatarUrl(user?.discordId, user?.avatar);
  const [usersRewards, setUsersRewars] = useState<UsersRewards>(null);

  if (!publicKey) {
    return null;
  }

  useEffect(() => {
    (async () => {
      const data = await networkRequest({
        url: process.env.REWARDS_ENDPOINT,
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

      return (
        <div className={styles.row}>
          <span>Rewards</span> {valueUserRewards.toFixed(2)} FRKT
        </div>
      );
    }
  };

  useEffect(() => {
    setAmplitudeUserId(publicKey?.toBase58());
  }, [publicKey]);

  const getBalanceValue = () => {
    const valueStr = `${formatNumber.format(
      (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
    )}`;
    return (
      <div className={styles.row}>
        <span>Balance</span> {valueStr} <SolanaIcon /> SOL
      </div>
    );
  };

  return (
    <div className={`${className} ${styles.wrapper}`}>
      <div className={styles.userWrapper}>
        <UserIcon className={styles.avatar} url={avatarUrl} />
        <div className={styles.userInfo}>
          <p>{shortenAddress(`${publicKey || ''}`)}</p>
          <LinkWithArrow
            to={`${PATHS.WALLET}/${publicKey.toString()}`}
            label="My profile"
            event="navigation-profile"
            className={styles.myCollectionLink}
          />
        </div>
      </div>
      {getBalanceValue()}
      {getRewardsValue()}
      {!user && (
        <a
          href={getDiscordUri(publicKey)}
          className={styles.discordButton}
          rel="noopener noreferrer"
        >
          <DiscordIcon
            onClick={() => sendAmplitudeData('navigation-discord')}
            className={styles.logo}
          />{' '}
          Link discord
        </a>
      )}
      <button onClick={disconnect} className={styles.disconnectButton}>
        Disconnect wallet
      </button>
    </div>
  );
};

export default CurrentUserTable;
