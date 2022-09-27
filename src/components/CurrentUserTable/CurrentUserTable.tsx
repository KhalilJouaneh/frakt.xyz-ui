import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { NavLink } from 'react-router-dom';
import { sum, filter, map } from 'ramda';

import { formatNumber, shortenAddress } from '../../utils/solanaUtils';
import { SolanaIcon, UserIcon } from '../../icons';

import { getDiscordUri, getDiscordAvatarUrl } from '../../utils';
import { PATHS } from '../../constants';
import { UserState } from '../../state/common/types';
import DiscordIcon from '../../icons/DiscordIcon2';
import { sendAmplitudeData, setAmplitudeUserId } from '../../utils/amplitude';
import styles from './styles.module.scss';
import { useNativeAccount } from '../../utils/accounts/useNativeAccount';
import Button from '../Button';
import { networkRequest } from '../../utils/state';
import { FRKT } from '../../iconsNew/FRKT';

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

      return valueUserRewards.toFixed(2);
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
      <div className={styles.column}>
        <p className={styles.columnTitle}>Balance</p>
        <p className={styles.columnValue}>
          {valueStr} <SolanaIcon />
        </p>
      </div>
    );
  };

  return (
    <div className={`${className} ${styles.wrapper}`}>
      <div className={styles.userWrapper}>
        <UserIcon className={styles.avatar} url={avatarUrl} />
        <div className={styles.userInfo}>
          <div className={styles.walletInfo}>
            <p className={styles.address}>
              {shortenAddress(`${publicKey || ''}`)}
            </p>
          </div>

          <NavLink
            onClick={() => sendAmplitudeData('navigation-profile')}
            to={`${PATHS.PROFILE}/${publicKey.toString()}`}
            className={styles.myCollectionLink}
          >
            My profile
          </NavLink>
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
      <Button
        className={styles.disconnectButton}
        onClick={disconnect}
        type="secondary"
      >
        Disconnect wallet
      </Button>
    </div>
  );
};

export default CurrentUserTable;
