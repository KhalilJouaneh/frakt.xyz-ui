import { FC } from 'react';

import { DailyActivity } from '@frakt/api/user';

import { DashboardStatsValues } from '../DashboardStatsValues';
import styles from './DailyActive.module.scss';
import Block from '../Block';

interface DailyStatsProps {
  data: DailyActivity;
}

const DailyActive: FC<DailyStatsProps> = ({ data }) => {
  return (
    <Block className={styles.content}>
      <h2 className={styles.title}>Daily Stats</h2>
      <div className={styles.blockWrapper}>
        <DashboardStatsValues
          label="Volume"
          value={data?.dailyVolume}
          type="solana"
          toFixed="0"
        />
        <DashboardStatsValues label="Issued" value={data?.issuedIn24Hours} />
        <DashboardStatsValues
          label="Paid back"
          value={data?.paidBackIn24Hours}
        />
        <DashboardStatsValues
          label="Graced"
          value={data?.liquidatedIn24Hours}
        />
      </div>
    </Block>
  );
};

export default DailyActive;
