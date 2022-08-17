import { Logo } from '../../iconsNew/Logo';
import { Frakt } from '../../iconsNew/Frakt';
import ConnectWallet from '../ConnectWallet';
import styles from './styles.module.scss';

export const Header = () => {
  return (
    <div className={styles.container}>
      <Logo />
      <Frakt />
      <div className={styles.widgetContainer}>
        <ConnectWallet />
      </div>
    </div>
  );
};
