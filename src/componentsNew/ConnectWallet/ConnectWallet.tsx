import Icons from '../../iconsNew';

import styles from './styles.module.scss';

export const ConnectWallet = () => (
  <div className={styles.container}>
    <div className={styles.icon}>
      <Icons.Person />
    </div>
    <div className={styles.text}>Connect Wallet</div>
  </div>
);
