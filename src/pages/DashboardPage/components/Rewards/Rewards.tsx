import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import Button from '@frakt/components/Button';

import styles from './Rewards.module.scss';
import Block from '../Block';

const Rewards: FC = () => {
  const { connected } = useWallet();

  return (
    <Block
      className={classNames(styles.block, {
        [styles.noConnectedBlock]: !connected,
      })}
    >
      <h3 className={styles.title}>My rewards</h3>
      {connected ? (
        <>
          <p className={styles.value}>0 FRAKT</p>
          <p className={styles.subtitle}>For the protocol use</p>
          <div className={styles.btnWrapper}>
            <Button className={styles.btn} type="secondary" disabled>
              Stake FRAKT
            </Button>
            <Button className={styles.btn} disabled>
              Claim FRAKT
            </Button>
          </div>
        </>
      ) : (
        <p className={styles.noConnectedMessage}>
          Please connect wallet to check your rewards balance
        </p>
      )}
    </Block>
  );
};

export default Rewards;
