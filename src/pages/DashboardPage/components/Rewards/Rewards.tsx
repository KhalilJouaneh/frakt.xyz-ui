import { FC } from 'react';

import Button from '../../../../components/Button';
import styles from './Rewards.module.scss';
import Block from '../Block';

const Rewards: FC = () => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>My rewards</h3>
      <div>
        <p className={styles.value}>0 FRAKT</p>
      </div>
      <div className={styles.tooltip}>
        <p className={styles.subtitle}>For the protocol use</p>
      </div>
      <div className={styles.btnWrapper}>
        <Button className={styles.btn} type="secondary" disabled>
          Stake FRAKT
        </Button>
        <Button className={styles.btn} disabled>
          Claim FRAKT
        </Button>
      </div>
    </Block>
  );
};

export default Rewards;
