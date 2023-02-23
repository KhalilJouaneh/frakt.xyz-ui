import { FC } from 'react';
import classNames from 'classnames';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';
import {
  BOND_SOL_DECIMAIL_DELTA,
  getBestPairForExit,
} from '@frakt/utils/bonds';

import { useBondCardActions } from '../../../hooks/useBondCard';

import styles from './TableCells.module.scss';

interface PnlProfitCellProps {
  bond: Bond;
  market: Market;
  pairs: Pair[];
  inMobile?: boolean;
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({
  bond,
  market,
  pairs,
  inMobile,
}) => {
  const { amountOfUserBonds, averageBondPrice } = bond;

  const { exitAvailable, bestPair } = useBondCardActions({
    bond,
    market,
    pairs,
  });

  const pnlLamports =
    (bestPair?.currentSpotPrice - averageBondPrice) * amountOfUserBonds;

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return (
    <>
      {exitAvailable && (
        <div
          className={classNames(styles.value, styles.column, {
            [styles.columnMobile]: inMobile,
          })}
        >
          <span>
            {(pnlLamports / 1e9).toFixed(3)} <Solana />
          </span>
          {!!pnlProfit && (
            <span
              className={classNames(styles.infoValueSpan, {
                [styles.negative]: pnlProfit < 0,
              })}
            >
              {pnlProfit < 0 ? '-' : '+'}
              {pnlProfit?.toFixed(3)} %
            </span>
          )}
        </div>
      )}
      {!exitAvailable && <EmptyValue />}
    </>
  );
};

const EmptyValue = (): JSX.Element => <div className={styles.value}>--</div>;

export const calcPnlProfit = ({ bond, market, pairs }) => {
  const { fbond, amountOfUserBonds, averageBondPrice } = bond;

  const ltvBasePoints =
    (fbond.amountToReturn / market?.oracleFloor?.floor) * 1e4;

  const bestPair = getBestPairForExit({
    pairs,
    ltvBasePoints,
    fbondTokenAmount: amountOfUserBonds,
    duration: (fbond.liquidatingAt - fbond.activatedAt) / (24 * 60 * 60),
  });

  const pnlLamports =
    (bestPair?.currentSpotPrice - averageBondPrice) * amountOfUserBonds;

  const pnlProfit = averageBondPrice
    ? pnlLamports / (averageBondPrice * BOND_SOL_DECIMAIL_DELTA)
    : 0;

  return pnlProfit;
};
