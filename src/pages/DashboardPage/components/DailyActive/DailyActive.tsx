import { FC } from 'react';

import { DailyActivity } from '../../../../state/stats/types';
import styles from './DailyActive.module.scss';
import { SolanaIcon } from '../../../../icons';
import Block from '../Block';

interface DailyStatsProps {
  dailyStats: DailyActivity;
}

const DailyActive: FC<DailyStatsProps> = ({ dailyStats }) => {
  const {
    lockedNftsInLoans,
    issuedIn24Hours,
    paidBackIn24Hours,
    liquidatedIn24Hours,
  } = dailyStats;

  return (
    <Block className={styles.content}>
      <h2 className={styles.title}>Daily Active</h2>
      <div className={styles.blockWrapper}>
        <div className={styles.block}>
          <h3 className={styles.subtitle}>Volume</h3>
          <p className={styles.value}>
            {lockedNftsInLoans} <SolanaIcon />
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.subtitle}>Issued</h3>
          <p className={styles.value}>{issuedIn24Hours}</p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.subtitle}>Paid back</h3>
          <p className={styles.value}>{paidBackIn24Hours}</p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.subtitle}>Liquidated</h3>
          <p className={styles.value}>{liquidatedIn24Hours}</p>
        </div>
      </div>
    </Block>
  );
};

export default DailyActive;
