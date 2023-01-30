import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';

import { AppLayout } from '../../components/Layout/AppLayout';
import AvailableBorrow from './components/AvailableBorrow';
import { selectStats } from '../../state/stats/selectors';
import { statsActions } from '../../state/stats/actions';
import ConnectWallet from './components/ConnectWallet';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import { Loader } from '../../components/Loader';
import styles from './DashboardPage.module.scss';
import LastLoans from './components/LastLoans';
import GraceList from './components/GraceList';
import MyDeposit from './components/MyDeposit';
import Lending from './components/Lending';
import Rewards from './components/Rewards';
import MyLoans from './components/MyLoans';

const DashboardPage: FC = () => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

  const { totalStats, lastLoans, lendingPools, dailyActivity, loading } =
    useSelector(selectStats);

  useEffect(() => {
    dispatch(statsActions.fetchStats());
  }, [dispatch]);

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      {loading ? (
        <Loader size="large" />
      ) : (
        <>
          {connected ? (
            <div className={styles.statsWrapper}>
              <h2 className={styles.subtitle}>Personal overview</h2>
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
          ) : (
            <div className={styles.statsWrapper}>
              <h2 className={styles.subtitle}>Personal overview</h2>
              <div className={styles.statsContainer}>
                <ConnectWallet />
              </div>
            </div>
          )}
          <div className={styles.statsWrapper}>
            <h2 className={styles.subtitle}>Protocol overview</h2>
            <div className={styles.statsContainer}>
              <div className={cx(styles.row, styles.rowDirection)}>
                <TotalStats totalStats={totalStats} />
                <DailyActive dailyStats={dailyActivity} />
              </div>
              <div className={cx(styles.row, styles.rowDirection)}>
                <Lending lendingPools={lendingPools} />
                <LastLoans lastLoans={lastLoans} />
              </div>
              <div className={cx(styles.row, styles.rowDirection)}>
                <GraceList />
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
