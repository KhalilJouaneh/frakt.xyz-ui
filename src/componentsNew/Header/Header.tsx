import { useSelector } from 'react-redux';
import { selectWalletModalVisible } from '../../state/common/selectors';
import WalletContent from '../../components/WalletContent';
import { Switch } from 'antd';
import { Logo } from '../../iconsNew/Logo';
import { Frakt } from '../../iconsNew/Frakt';
import ConnectWallet from '../ConnectWallet';
import styles from './styles.module.scss';

export const Header = () => {
  const visible = useSelector(selectWalletModalVisible);
  const handleThemeChange = (evt) => {};

  return (
    <div className={styles.container}>
      {visible && <WalletContent />}
      <Logo />
      <Frakt />
      <div className={styles.widgetContainer}>
        <ConnectWallet />
        <Switch className={styles.toggle} onChange={handleThemeChange} />
      </div>
    </div>
  );
};
