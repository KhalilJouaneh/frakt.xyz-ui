import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectWalletModalVisible } from '../../state/common/selectors';
import ConnectedButton from '../../components/ConnectedButton';
import WalletContent from '../../components/WalletContent';
import ThemeSwitcher from '../ThemeSwitcher';
import { Logo } from '../../iconsNew/Logo';
import ConnectWallet from '../ConnectWallet';
import styles from './styles.module.scss';
import BurgerMenu from '../../components/BurgerMenu';

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
      >
        <Logo className={styles.logo} />
      </a>
      <div className={styles.widgetContainer}>
        {connected ? (
          <ConnectedButton className={styles.walletBtn} />
        ) : (
          <ConnectWallet />
        )}
        <div className={styles.switcher}>
          <ThemeSwitcher />
        </div>
      </div>
      <BurgerMenu />
    </div>
  );
};
