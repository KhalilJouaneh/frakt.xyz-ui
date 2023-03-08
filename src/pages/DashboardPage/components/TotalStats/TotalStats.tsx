import { FC } from 'react';

import { TotalStats as TotalStatsInterface } from '@frakt/api/user';

import { DashboardStatsValues } from '../DashboardStatsValues';
import styles from './TotalStats.module.scss';
import Block from '../Block';

interface TotalStatsProps {
  data: TotalStatsInterface;
}

const TotalStats: FC<TotalStatsProps> = ({ data }) => {
  return (
    <Block className={styles.block}>
      <h2 className={styles.title}>Total stats</h2>
      <div className={styles.statsWrapper}>
        <DashboardStatsValues
          label="Total value locked"
          value={data?.loansTvl}
          type="solana"
          toFixed="0"
        />
        <DashboardStatsValues
          label="Loans volume all time"
          value={data?.loansVolumeAllTime}
          type="solana"
          toFixed="0"
        />
        <DashboardStatsValues
          label="Active loans"
          value={data?.activeLoansCount}
        />
      </div>
    </Block>
  );
};

export default TotalStats;
