import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';

import { useFetchAllRaffleList } from '@frakt/hooks/useRaffleData';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Loader } from '@frakt/components/Loader';

import AvailableBorrow from './components/AvailableBorrow';
import DailyActive from './components/DailyActive';
import TotalStats from './components/TotalStats';
import LastLoans from './components/LastLoans';
import GraceList from './components/GraceList';
import MyDeposit from './components/MyDeposit';
import { useWalletLoans } from '../LoansPage';
import Lending from './components/Lending';
import { useFetchAllStats } from './hooks';
import Rewards from './components/Rewards';
import MyLoans from './components/MyLoans';

import styles from './DashboardPage.module.scss';

const DashboardPage: FC = () => {
  const { publicKey: walletPublicKey, connected } = useWallet();

  const { data, loading } = useFetchAllStats({ walletPublicKey });
  const { loans, isLoading } = useWalletLoans({ walletPublicKey });

  const { data: graceList, loading: isLoadingGraceList } =
    useFetchAllRaffleList();

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>{connected ? 'Dashboard' : 'Welcome'}</h1>
      </div>
      {!connected || !isLoading ? (
        <>
          <div className={styles.statsWrapper}>
            <div className={styles.statsContainer}>
              <div className={styles.row}>
                <MyLoans userLoans={loans} />
                <MyDeposit data={data?.bonds} />
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
                <TotalStats data={data?.totalStats} />
                <DailyActive data={data?.dailyActivity} />
              </div>
              <div className={cx(styles.row, styles.rowDirection)}>
                <Lending loading={loading} data={data?.lendingPools} />
                <LastLoans loading={loading} data={data?.lastLoans} />
              </div>
              <div className={cx(styles.row, styles.rowDirection)}>
                <GraceList
                  isLoading={isLoadingGraceList}
                  graceList={graceList}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </AppLayout>
  );
};

export default DashboardPage;
