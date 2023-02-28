import { FC } from 'react';

import { Solana } from '@frakt/icons';
import styles from './DashboardStatsValues.module.scss';

interface DashboardStatsValuesProps {
  label: string;
  value?: number;
  type?: string;
  toFixed?: string;
}

const valuesTypes = {
  percent: '%',
  solana: <Solana className={styles.icon} />,
};

export const DashboardStatsValues: FC<DashboardStatsValuesProps> = ({
  label,
  value,
  type,
  toFixed,
}) => {
  const toFixedSolValue = type === 'solana' ? 2 : 0;
  const toFixedValue = toFixed ? parseFloat(toFixed) : toFixedSolValue;

  return (
    <div className={styles.block}>
      <h3 className={styles.subtitle}>{label}</h3>
      <p className={styles.value}>
        {value?.toFixed(toFixedValue) || '--'} {valuesTypes[type]}
      </p>
    </div>
  );
};
