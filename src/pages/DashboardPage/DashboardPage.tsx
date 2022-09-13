import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectStats } from '../../state/stats/selectors';
import { statsActions } from '../../state/stats/actions';
import ConnectWallet from './components/ConnectWallet';
import { Container } from '../../components/Layout';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import { Loader } from '../../components/Loader';
import styles from './DashboardPage.module.scss';
import LastLoans from './components/LastLoans';
import GraceList from './components/GraceList';
import Lending from './components/Lending';
import Rewards from './components/Rewards';
import MyLoans from './components/MyLoans';
import AvailableBorrow from './components/AvailableBorrow';
import MyDeposit from './components/MyDeposit';

const DashboardPage: FC = () => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

  const { totalStats, lastLoans, lendingPools, dailyActivity, loading } =
    useSelector(selectStats);

  useEffect(() => {
    dispatch(statsActions.fetchStats());
  }, [dispatch]);

  return (
    <Container component="main" className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <h2 className={styles.subtitle}>Personal overview</h2>
        </div>
      </div>

      {loading ? (
        <Loader size="large" />
      ) : (
        <>
          {connected ? (
            <div className={styles.protocolStats}>
              <MyLoans />
              <MyDeposit lendingPools={lendingPools} />
              <Rewards />
              <AvailableBorrow />
            </div>
          ) : (
            <ConnectWallet />
          )}

          <div className={styles.protocolStats}>
            <TotalStats totalStats={totalStats} />
            <DailyActive dailyStats={dailyActivity} />
            <LastLoans lastLoans={lastLoans} />
            <Lending lendingPools={lendingPools} />
            <GraceList />
          </div>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
