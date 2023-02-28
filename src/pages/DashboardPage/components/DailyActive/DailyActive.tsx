import { FC } from 'react';

import { DailyActivity } from '@frakt/state/stats/types';

import { DashboardStatsValues } from '../DashboardStatsValues';
import Block from '../Block';

import styles from './DailyActive.module.scss';

interface DailyStatsProps {
  dailyStats: DailyActivity;
}

const DailyActive: FC<DailyStatsProps> = ({ dailyStats }) => {
  const {
    dailyVolume,
    issuedIn24Hours,
    paidBackIn24Hours,
    liquidatedIn24Hours,
  } = dailyStats;

  return (
    <Block className={styles.content}>
      <h2 className={styles.title}>Daily Stats</h2>
      <div className={styles.blockWrapper}>
        <DashboardStatsValues label="Volume" value={dailyVolume} isSolValue />
        <DashboardStatsValues label="Issued" value={issuedIn24Hours} />
        <DashboardStatsValues label="Paid back" value={paidBackIn24Hours} />
        <DashboardStatsValues label="Graced" value={liquidatedIn24Hours} />
      </div>
    </Block>
  );
};

export default DailyActive;
