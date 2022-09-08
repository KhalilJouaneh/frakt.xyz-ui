import { FC, useEffect, useState } from 'react';

import styles from './Statistics.module.scss';
import { Container } from '../../../../components/Layout';
import { Stats } from './model';
import { fetchStats } from './helpers';

export const tvlFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const nftsLockedFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const useStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchAndSetStats = async () => {
    setLoading(true);
    const stats = await fetchStats();

    setStats(stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetStats();
  }, []);

  return {
    stats,
    loading,
  };
};

const Statistics: FC = () => {
  const { stats } = useStats();

  return (
    <Container component="section" className={styles.root}>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span>
            {stats?.nftsLocked
              ? nftsLockedFormatter.format(stats?.nftsLocked)
              : '---'}
          </span>
        </span>
        <span className={styles.title}>NFTs locked</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>
          <span>{stats?.TVL ? tvlFormatter.format(stats?.TVL) : '---'}</span>
        </span>
        <span className={styles.title}>Total Value Locked</span>
      </div>
    </Container>
  );
};

export default Statistics;
