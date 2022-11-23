import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectWalletModalVisible } from '../../state/common/selectors';
import ConnectButton from '@frakt/components/ConnectButton';
import WalletContent from '@frakt/components/WalletContent';
import ThemeSwitcher from '@frakt/componentsNew/ThemeSwitcher';
import { Logo } from '@frakt/iconsNew/Logo';
import styles from './Header.module.scss';
import BurgerMenu from '@frakt/components/BurgerMenu';
import { NotificationsButton } from '@frakt/components/NotificationsButton';

export const Header: FC = () => {
  const visible = useSelector(selectWalletModalVisible);
  const { connected } = useWallet();

  return (
    <div className={styles.container}>
      {visible && <WalletContent />}
      <a
        href="https://frakt-landing.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoWrapper}
      >
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
