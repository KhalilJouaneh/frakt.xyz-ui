import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectWalletModalVisible } from '../../state/common/selectors';
import ConnectButton from '@frakt/components/ConnectButton';
import WalletContent from '@frakt/components/WalletContent';
import ThemeSwitcher from '@frakt/components/ThemeSwitcher';
import { Logo } from '@frakt/icons';
import styles from './Header.module.scss';
import BurgerMenu from '@frakt/components/BurgerMenu';
import { NotificationsButton } from '@frakt/components/NotificationsButton';

export const Header: FC = () => {
  const visible = useSelector(selectWalletModalVisible);
  const { connected } = useWallet();

  return (
    <div className={styles.container}>
      {visible && <WalletContent />}
      <a href={process.env.FRAKT_LANDING_URL} className={styles.logoWrapper}>
        <Logo className={styles.logo} />
      </a>
      <div className={styles.widgetContainer}>
        <div className={styles.switcherContainer}>
          <ThemeSwitcher />
        </div>
        {connected && <NotificationsButton />}
        <ConnectButton className={styles.walletBtn} />
      </div>
      <BurgerMenu />
    </div>
  );
};
