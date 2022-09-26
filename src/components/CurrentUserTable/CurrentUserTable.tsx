import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { NavLink } from 'react-router-dom';

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

interface CurrentUserTableProps {
  className?: string;
  user?: UserState;
}

const CurrentUserTable = ({
  className = '',
  user = null,
}: CurrentUserTableProps): JSX.Element => {
  const { disconnect, publicKey } = useWallet();
  const { account } = useNativeAccount();
  const avatarUrl = getDiscordAvatarUrl(user?.discordId, user?.avatar);

  if (!publicKey) {
    return null;
  }

  useEffect(() => {
    setAmplitudeUserId(publicKey?.toBase58());
  }, [publicKey]);

  const getBalanceValue = () => {
    const valueStr = `${formatNumber.format(
      (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
    )}`;
    return (
      <div className={styles.row}>
        {valueStr} <SolanaIcon />
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
            {getBalanceValue()}
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
