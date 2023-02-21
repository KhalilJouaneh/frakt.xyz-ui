import { FC } from 'react';
import classNames from 'classnames';

import { BOND_SOL_DECIMAIL_DELTA } from '@frakt/utils/bonds';
import { Bond, Market, Pair } from '@frakt/api/bonds';
import { Solana } from '@frakt/icons';

import { useBondCardActions } from '../../../hooks/useBondCard';

import styles from './TableCells.module.scss';

interface PnlProfitCellProps {
  bond: Bond;
  market: Market;
  pairs: Pair[];
}

export const PnlProfitCell: FC<PnlProfitCellProps> = ({
  bond,
  market,
  pairs,
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
        <div className={styles.value}>
          {(pnlLamports / 1e9).toFixed(3)} <Solana />
          {!!pnlProfit && (
            <span
              className={classNames(styles.infoValueSpan, {
                [styles.negative]: pnlProfit < 0,
              })}
            >
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
