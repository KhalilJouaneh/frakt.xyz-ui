import { FC, Fragment } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { calcWeightedAverage } from '@frakt/utils';
import { BondsUserStats } from '@frakt/api/user';
import { PATHS } from '@frakt/constants';

import { BadgeJSX, NavigationButtonJSX, NoConnectedJSX } from './components';
import { DashboardStatsValues } from '../DashboardStatsValues';
import Block from '../Block';
import styles from './MyDeposit.module.scss';

interface MyDepositProps {
  data: BondsUserStats;
}

const MyDeposit: FC<MyDepositProps> = ({ data }) => {
  const { connected } = useWallet();
  const liquidityPools = useSelector(selectLiquidityPools);

  const depositAmount = (pool) => pool?.userDeposit?.depositAmount;
  const depositApr = ({ depositApr }) => depositApr;

  const depositedPools = filter(depositAmount, liquidityPools);
  const totalLiquidity = sum(map(depositAmount, depositedPools)) || 0;

  const depositedAmountsNumbers = map(depositAmount, depositedPools);
  const depositedAPRsNumbers = map(depositApr, depositedPools);

  const weightedAvarageApy = calcWeightedAverage(
    depositedAPRsNumbers,
    depositedAmountsNumbers,
  );

  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>{connected ? 'My deposits' : 'Lending'}</h3>
      <div className={styles.container}>
        <PoolsInfoJSX
          weightedAvarageApy={weightedAvarageApy}
          totalLiquidity={totalLiquidity}
        />
        <StrategiesInfoJSX />
      </div>
      <BondsInfoJSX
        activeUserLoans={data?.activeUserLoans}
        bondUserAmount={data?.bondUserAmount}
        userOffers={data?.userOffers}
        userOffersAmount={data?.userOffersAmount}
      />
    </Block>
  );
};

export default MyDeposit;

const PoolsInfoJSX = ({ weightedAvarageApy, totalLiquidity }) => {
  const { connected } = useWallet();

  return (
    <Block className={styles.wrapper}>
      <h4 className={styles.subtitle}>Pools</h4>
      {connected && (
        <Fragment>
          <div className={styles.badges}>
            <BadgeJSX label="Risk: Moderate" />
            <BadgeJSX label="APR: 8%-20%" />
          </div>
          <div className={styles.content}>
            <DashboardStatsValues
              label="Weighted APY"
              value={weightedAvarageApy}
              type="percent"
            />
            <DashboardStatsValues
              label="Total liquidity"
              value={totalLiquidity}
              type="solana"
            />
          </div>
        </Fragment>
      )}
      {!connected && (
        <NoConnectedJSX
          values={[
            {
              label: 'Risk',
              value: 'Moderate',
            },
            {
              label: 'Apr',
              value: '8%-20%',
            },
          ]}
        />
      )}
      <NavigationButtonJSX
        path={PATHS.LEND}
        label={connected ? 'Manage' : 'Jump to pools'}
      />
    </Block>
  );
};

const StrategiesInfoJSX = () => {
  const { connected } = useWallet();

  return (
    <Block className={styles.wrapper}>
      <h4 className={styles.subtitle}>Strategies</h4>
      {connected && (
        <Fragment>
          <div className={styles.badges}>
            <BadgeJSX label="Risk: High" />
            <BadgeJSX label="APR: 18%-40%" />
          </div>
          <div className={styles.content}>
            <DashboardStatsValues
              label="Weighted APY"
              value={0}
              type="percent"
            />
            <DashboardStatsValues
              label="Total liquidity"
              value={0}
              type="solana"
            />
          </div>
        </Fragment>
      )}
      {!connected && (
        <NoConnectedJSX
          values={[
            {
              label: 'Risk',
              value: 'High',
            },
            {
              label: 'Apr',
              value: '18%-40%',
            },
          ]}
        />
      )}
      <NavigationButtonJSX
        disabled={true}
        path={PATHS.LEND}
        label={connected ? 'Manage' : 'Jump to strategies'}
      />
    </Block>
  );
};

const BondsInfoJSX = ({
  activeUserLoans,
  bondUserAmount,
  userOffers,
  userOffersAmount,
}) => {
  const { connected } = useWallet();

  return (
    <Block className={styles.wrapper}>
      <h4 className={styles.subtitle}>Bonds</h4>
      {connected && (
        <Fragment>
          <div className={styles.badges}>
            <BadgeJSX label="Risk: High" />
            <BadgeJSX label="APR: 40%+" />
          </div>
          <div className={styles.content}>
            <div className={styles.values}>
              <DashboardStatsValues label="Offers" value={userOffers} />
              <span className={styles.value}>
                {userOffersAmount?.toFixed(2) || '--'} SOL
              </span>
            </div>
            <div className={styles.values}>
              <DashboardStatsValues label="Bonds" value={activeUserLoans} />
              <span className={styles.value}>
                {bondUserAmount?.toFixed(2) || '--'} SOL
              </span>
            </div>
          </div>
        </Fragment>
      )}
      {!connected && (
        <NoConnectedJSX
          values={[
            {
              label: 'Risk',
              value: 'High',
            },
            {
              label: 'Apr',
              value: '40%+',
            },
          ]}
          className={styles.bondsContainer}
        />
      )}
      <NavigationButtonJSX
        path={PATHS.BONDS}
        label={connected ? 'Manage' : 'Jump to bonds'}
      />
    </Block>
  );
};
