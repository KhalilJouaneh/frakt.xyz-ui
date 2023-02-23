import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';
import { Bond, Market, Pair } from '@frakt/api/bonds';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  market: Market;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
  mobileBreakpoint?: number;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  market,
  pairs,
  onExit,
  onRedeem,
  mobileBreakpoint,
}) => {
  const COLUMNS = TableList({ market, pairs, onExit, onRedeem });

  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    searchParams: {
      searchField: 'collectionName',
    },
  });

  return (
    <Table search={search} {...table} mobileBreakpoint={mobileBreakpoint} />
  );
};
