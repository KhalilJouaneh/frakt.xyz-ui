import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';
import { TableList } from './constants';
import { Bond, Market, Pair } from '@frakt/api/bonds';

export interface CollectionsTableProps {
  data: ReadonlyArray<any>;
  loading: boolean;
  market: Market;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const CollectionsTable: FC<CollectionsTableProps> = ({
  data,
  loading,
  market,
  pairs,
  onExit,
  onRedeem,
}) => {
  const COLUMNS = TableList({ market, pairs, onExit, onRedeem });

  const { table } = useTable({
    data,
    columns: COLUMNS,
    rowKeyField: 'collectionId',
    noDataMessage: "You don't have suitable collections :(",
    loading,
    searchParams: {
      searchField: 'collectionName',
      debounceWait: 300,
      placeHolderText: 'search by token name',
    },
  });

  return <Table {...table} />;
};
