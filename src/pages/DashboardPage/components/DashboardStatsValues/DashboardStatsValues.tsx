import { FC } from 'react';

import { Solana } from '@frakt/icons';
import styles from './DashboardStatsValues.module.scss';

interface DashboardStatsValuesProps {
  label: string;
  value?: number;
  isSolValue?: boolean;
}

export const DashboardStatsValues: FC<DashboardStatsValuesProps> = ({
  label,
  value,
  isSolValue = false,
}) => {
  return (
    <div className={styles.block}>
      <h3 className={styles.subtitle}>{label}</h3>
      <p className={styles.value}>
        {value?.toFixed(0) || '--'}
        {isSolValue && <Solana className={styles.icon} />}
      </p>
    </div>
  );
};
