import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectUser } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import { sendAmplitudeData } from '../../utils/amplitude';
import CurrentUserTable from '../CurrentUserTable';
import { useOnClickOutside } from '../../utils';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';

interface WalletContentProps {
  className?: string;
}

export const WalletsItems = () => {
  const { wallets, select } = useWallet();
  const dispatch = useDispatch();

  return (
    <div className={styles.itemsContainer}>
      {wallets.map(({ adapter }, idx) => (
        <WalletItem
          key={idx}
          onClick={(): void => {
            select(adapter.name);
            dispatch(commonActions.setWalletModal({ isVisible: false }));
          }}
          imageSrc={adapter.icon}
          imageAlt={adapter.name}
          name={adapter.name}
        />
      ))}
    </div>
  );
};

const WalletContent = ({ className = '' }: WalletContentProps): JSX.Element => {
  const dispatch = useDispatch();
  const { connected } = useWallet();
  const user = useSelector(selectUser);

  const ref = useRef();
  useOnClickOutside(ref, () =>
    dispatch(commonActions.setWalletModal({ isVisible: false })),
  );

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        className={styles.overlay}
        onClick={() => {
          dispatch(commonActions.setWalletModal({ isVisible: false }));
          sendAmplitudeData('navigation-connect');
        }}
      />
      <div ref={ref} className={`${styles.container} container`}>
        {connected ? (
          <CurrentUserTable className={styles.itemsContainer} user={user} />
        ) : (
          <WalletsItems />
        )}
      </div>
    </div>
  );
};

export default WalletContent;
