import { useDispatch } from 'react-redux';
import { commonActions } from '../../state/common/actions';

import Icons from '../../iconsNew';

import styles from './styles.module.scss';

export const ConnectWallet = () => {
  const dispatch = useDispatch();

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      <div className={styles.icon}>
        <Icons.Person />
      </div>
      <div className={styles.text}>Connect Wallet</div>
    </div>
  );
};
