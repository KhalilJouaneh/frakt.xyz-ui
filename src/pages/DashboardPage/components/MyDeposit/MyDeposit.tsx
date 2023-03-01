import { FC, Fragment } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { calcWeightedAverage } from '@frakt/utils';
import { PATHS } from '@frakt/constants';

import styles from './MyDeposit.module.scss';
import Block from '../Block';
import { DashboardStatsValues } from '../DashboardStatsValues';
import { BadgeJSX, NavigationButtonJSX, NoConnectedJSX } from './components';
import { useFetchAllUserBonds } from '@frakt/utils/bonds';
import { createMyBondsStats } from '@frakt/pages/MarketsPage/helpers';

const MyDeposit: FC = () => {
  const { connected, publicKey } = useWallet();
  const liquidityPools = useSelector(selectLiquidityPools);

  const { bonds } = useFetchAllUserBonds({ walletPubkey: publicKey });
  const { locked, activeLoans } = createMyBondsStats(bonds);

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
      <BondsInfoJSX activeBonds={activeLoans} locked={locked} />
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
            <BadgeJSX label="APR: 8%-20%" />
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
              value: '8%-20%',
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

const BondsInfoJSX = ({ activeBonds, locked }) => {
  const { connected } = useWallet();

  return (
    <Block className={styles.wrapper}>
      <h4 className={styles.subtitle}>Bonds</h4>
      {connected && (
        <Fragment>
          <div className={styles.badges}>
            <BadgeJSX label="Risk: High" />
            <BadgeJSX label="APR: 8%-20%" />
          </div>
          <div className={styles.content}>
            <div className={styles.values}>
              <DashboardStatsValues label="Offers" value={0} />
              <span className={styles.value}>0 SOL</span>
            </div>
            <div className={styles.values}>
              <DashboardStatsValues label="Bonds" value={activeBonds} />
              <span className={styles.value}>
                {locked?.toFixed(2) || '--'} SOL
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
