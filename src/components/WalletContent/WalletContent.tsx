import { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { commonActions } from '../../state/common/actions';
import { sendAmplitudeData } from '../../utils/amplitude';
import CurrentUserTable from '../CurrentUserTable';
import { useOnClickOutside } from '../../utils';
import styles from './styles.module.scss';
import { WalletItem } from './WalletItem';

interface WalletContentProps {
  className?: string;
}

export const WalletsItems: FC = () => {
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

const WalletContent: FC<WalletContentProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

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
          <CurrentUserTable className={styles.itemsContainer} />
        ) : (
          <WalletsItems />
        )}
      </div>
    </div>
  );
};

export default WalletContent;
