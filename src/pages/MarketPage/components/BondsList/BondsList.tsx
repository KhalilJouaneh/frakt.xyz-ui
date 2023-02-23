import { FC } from 'react';

import { Bond, Market, Pair } from '@frakt/api/bonds';

import { BondsTable } from './components/BondsTable';
import styles from './BondsList.module.scss';

interface BondsListProps {
  market: Market;
  bonds: Bond[];
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const BondsList: FC<BondsListProps> = ({
  market,
  bonds,
  pairs,
  onRedeem,
  onExit,
}) => {
  return (
    <div className={styles.bondList}>
      <BondsTable
        data={bonds}
        market={market}
        pairs={pairs}
        onRedeem={onRedeem}
        onExit={onExit}
        mobileBreakpoint={1380}
      />
    </div>
  );
};
