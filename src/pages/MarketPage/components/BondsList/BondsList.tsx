import { FC } from 'react';

import { Bond, Market, Pair } from '@frakt/api/bonds';

import styles from './BondsList.module.scss';
import { BondCard } from '../BondCard';
import SortableList from './components/SortableList';

interface BondsListProps {
  market: Market;
  bonds: Bond[];
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

//TODO: Implemet normal filters
export const BondsList: FC<BondsListProps> = ({
  market,
  bonds,
  pairs,
  onRedeem,
  onExit,
}) => {
  return (
    <div>
      <SortableList options={SORT_VALUES} />
      <div className={styles.bondList}>
        {bonds.map((bond, idx) => (
          <BondCard
            key={idx}
            bond={bond}
            pairs={pairs}
            market={market}
            onRedeem={onRedeem}
            onExit={onExit}
          />
        ))}
      </div>
    </div>
  );
};

const SORT_VALUES = [
  {
    key: 'name',
    title: 'Collateral name',
  },
  {
    key: 'size',
    title: 'Size',
    tooltip:
      'Amount of SOL you want to lend for a specific collection at the chosen LTV & APY',
  },
  {
    key: 'interest',
    title: 'Interest',
    tooltip: 'Interest (in %) for the duration of this loan',
  },
  {
    key: 'expiration',
    title: 'Expiration',
    tooltip: 'When the loan is paid back or liquidated',
  },
  {
    key: 'pnl',
    title: 'PNL',
    tooltip:
      'Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)',
  },
];
