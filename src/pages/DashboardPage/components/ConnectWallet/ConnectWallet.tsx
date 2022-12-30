import { FC } from 'react';

import ConnectButton from '../../../../components/ConnectButton';
import styles from './ConnectWallet.module.scss';
import Block from '../Block';
import { Person } from '@frakt/icons';

const ConnectWallet: FC = () => {
  return (
    <Block className={styles.block}>
      <Person />
      <p className={styles.title}>Please connect wallet to see your stats</p>
      <ConnectButton className={styles.btn} />
    </Block>
  );
};

export default ConnectWallet;
