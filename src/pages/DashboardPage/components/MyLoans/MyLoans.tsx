import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { Loan } from '@frakt/api/loans';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';

import { ChartPie, defaultColors } from './components/ChartPie';
import NoConnectedMyLoans from './components/NoConnectedState';
import { DashboardStatsValues } from '../DashboardStatsValues';
import Block from '../Block';
import {
  calcLoansAmounts,
  calcTotalLoansAmout,
  getFilteredPools,
  getPoolsInfoForView,
} from './helpers';

import styles from './MyLoans.module.scss';

const MyLoans: FC<{ userLoans: Loan[] }> = ({ userLoans }) => {
  const { connected } = useWallet();

  const liquidityPools = useSelector(selectLiquidityPools);

  const { totalBorrowed, totalDebt, totalLoans } =
    calcTotalLoansAmout(userLoans);

  const {
    flipRepayValue,
    perpetualRepayValue,
    bondRepayValue,
    graceLoansValue,
    graceLoans,
  } = calcLoansAmounts(userLoans);

  const { perpetualPools, flipPools } = getFilteredPools(liquidityPools);
  const { restFlipPoolImages } = getPoolsInfoForView(perpetualPools, flipPools);

  const loansInfo = [
    { name: 'Flip', value: flipRepayValue?.toFixed(3) },
    { name: 'Perpetual', value: perpetualRepayValue?.toFixed(3) },
    { name: 'On grace', value: graceLoansValue?.toFixed(3) },
    { name: 'Bond', value: bondRepayValue?.toFixed(3) },
  ];

  return (
    <Block className={styles.block}>
      {!!graceLoans?.length && <LiquidationBadge amount={graceLoans?.length} />}
      <div className={styles.poolsConainer}>
        <h3 className={styles.title}>{connected ? 'My loans' : 'Borrowing'}</h3>
        {userLoans.length ? (
          <>
            <div className={styles.loansInfoWrapper}>
              <DashboardStatsValues
                label="Total borrowed"
                value={totalBorrowed}
                type="solana"
              />
              <DashboardStatsValues
                label="Total debt"
                value={totalDebt}
                type="solana"
              />
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chart}>
                <ChartPie
                  rawData={loansInfo}
                  width={192}
                  label={
                    <div className={styles.labelWrapper}>
                      <p className={styles.labelValue}>{totalLoans}</p>
                      <p className={styles.label}>Loans</p>
                    </div>
                  }
                />
              </div>
              <div className={styles.chartInfo}>
                {loansInfo.map(({ name, value }, idx) => (
                  <div key={idx} className={styles.row}>
                    <div className={styles.rowInfo}>
                      <div
                        className={styles.dot}
                        style={{ background: defaultColors[idx] }}
                      />
                      <p className={styles.name}>{name}</p>
                    </div>
                    <p className={styles.value}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <NoConnectedMyLoans restFlipPoolImages={restFlipPoolImages} />
        )}
      </div>
      <NavLink
        style={{ width: '100%' }}
        to={userLoans.length ? PATHS.LOANS : PATHS.BORROW_ROOT}
      >
        <Button className={styles.btn} type="secondary">
          {userLoans.length ? 'Repay' : 'Jump to borrowing'}
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyLoans;

const LiquidationBadge = ({ amount }: { amount: number }) => (
  <div className={styles.badge}>Soon liquidate: {amount} NFTs</div>
);
