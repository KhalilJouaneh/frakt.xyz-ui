import { FC } from 'react';

import { TotalStats as TotalStatsInterface } from '@frakt/state/stats/types';

import { DashboardStatsValues } from '../DashboardStatsValues';
import Block from '../Block';

import styles from './TotalStats.module.scss';

interface TotalStatsProps {
  totalStats: TotalStatsInterface;
}

const TotalStats: FC<TotalStatsProps> = ({ totalStats }) => {
  const { activeLoansCount, loansTvl, loansVolumeAllTime } = totalStats;

  return (
    <Block className={styles.block}>
      <h2 className={styles.title}>Total stats</h2>
      <div className={styles.statsWrapper}>
        <DashboardStatsValues
          label="Total value locked"
          value={loansTvl}
          isSolValue
        />
        <DashboardStatsValues
          label="Loans volume all time"
          value={loansVolumeAllTime}
          isSolValue
        />
        <DashboardStatsValues label="Active loans" value={activeLoansCount} />
      </div>
    </Block>
  );
};

export default TotalStats;
