import { FC } from 'react';

import { Bond, Market, Pair } from '@frakt/api/bonds';

import {
  SORT_OPTIONS,
  useSortableBondList,
} from './components/SortableList/hooks';
import SortableList from './components/SortableList';
import styles from './BondsList.module.scss';
import { BondCard } from '../BondCard';
import { CollectionsTable } from './components/BondsTable';

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
    <div className={styles.bondList}>
      <CollectionsTable
        data={bonds}
        loading={false}
        market={market}
        pairs={pairs}
        onRedeem={onRedeem}
        onExit={onExit}
      />
      {/* <SortableList
        orderState={orderState}
        onChangeSortOrder={onChangeSortOrder}
        setValue={setValue}
        options={SORT_OPTIONS}
        fieldValue={fieldValue}
      /> */}
      {/* <div className={styles.bondList}>
        {bonds.map((bond: Bond, idx: number) => (
          <BondCard
            key={idx}
            bond={bond}
            pairs={pairs}
            market={market}
            onRedeem={onRedeem}
            onExit={onExit}
          />
        ))}
      </div> */}
    </div>
  );
};
