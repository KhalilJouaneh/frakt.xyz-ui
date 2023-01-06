import { FC } from 'react';

import { Solana } from '@frakt/icons';
import styles from './TotalStats.module.scss';
import Block from '../Block';
import { TotalStats as TotalStatsInterface } from '../../../../state/stats/types';

interface TotalStatsProps {
  totalStats: TotalStatsInterface;
}

const TotalStats: FC<TotalStatsProps> = ({ totalStats }) => {
  const { activeLoansCount, loansTvl, loansVolumeAllTime } = totalStats;

  return (
    <Block className={styles.block}>
      <h2 className={styles.title}>Total stats</h2>
      <div className={styles.statsWrapper}>
        <div className={styles.statsInfo}>
          <div className={styles.valueInfo}>
            <p className={styles.value}>{loansTvl?.toFixed()}</p>
            <Solana className={styles.icon} />
          </div>
          <h3 className={styles.subtitle}>Total value locked</h3>
        </div>
        <div className={styles.statsInfo}>
          <div className={styles.valueInfo}>
            <p className={styles.value}>{loansVolumeAllTime?.toFixed()}</p>
            <Solana className={styles.icon} />
          </div>
          <h3 className={styles.subtitle}>Loans volume all time</h3>
        </div>
        <div className={styles.statsInfo}>
          <p className={styles.value}>{activeLoansCount}</p>
          <h3 className={styles.subtitle}>Active loans</h3>
        </div>
      </div>
    </Block>
  );
};

export default TotalStats;
