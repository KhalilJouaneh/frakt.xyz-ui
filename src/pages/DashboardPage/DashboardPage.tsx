import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import { useFetchAllRaffleList } from '@frakt/hooks/useRaffleData';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { selectStats } from '@frakt/state/stats/selectors';
import { statsActions } from '@frakt/state/stats/actions';

import AvailableBorrow from './components/AvailableBorrow';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import LastLoans from './components/LastLoans';
import GraceList from './components/GraceList';
import MyDeposit from './components/MyDeposit';
import Lending from './components/Lending';
import Rewards from './components/Rewards';
import MyLoans from './components/MyLoans';

import styles from './DashboardPage.module.scss';

const DashboardPage: FC = () => {
  const dispatch = useDispatch();

  const { totalStats, lastLoans, lendingPools, dailyActivity, loading } =
    useSelector(selectStats);

  useEffect(() => {
    dispatch(statsActions.fetchStats());
  }, [dispatch]);

  const { data: graceList, loading: isLoadingGraceList } =
    useFetchAllRaffleList();

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>
      <>
        <div className={styles.statsWrapper}>
          <div className={styles.statsContainer}>
            <div className={styles.row}>
              <MyLoans />
              <MyDeposit />
            </div>
            <div className={cx(styles.row, styles.rowDirection)}>
              <Rewards />
              <AvailableBorrow />
            </div>
          </div>
        </div>
        <div className={styles.statsWrapper}>
          <h2 className={styles.subtitle}>Protocol overview</h2>
          <div className={styles.statsContainer}>
            <div className={cx(styles.row, styles.rowDirection)}>
              <TotalStats totalStats={totalStats} />
              <DailyActive dailyStats={dailyActivity} />
            </div>
            <div className={cx(styles.row, styles.rowDirection)}>
              <Lending loading={loading} lendingPools={lendingPools} />
              <LastLoans loading={loading} lastLoans={lastLoans} />
            </div>
            <div className={cx(styles.row, styles.rowDirection)}>
              <GraceList isLoading={isLoadingGraceList} graceList={graceList} />
            </div>
          </div>
        </div>
      </>
    </AppLayout>
  );
};

export default DashboardPage;
