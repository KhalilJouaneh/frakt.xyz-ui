import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';
import { Bond, Market, Pair } from '@frakt/api/bonds';

import { TableList } from './columns';
import { useWindowSize } from '@frakt/hooks';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  market: Market;
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
  mobileBreakpoint?: number;
  loading?: boolean;
  className?: string;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  market,
  pairs,
  onExit,
  onRedeem,
  mobileBreakpoint = 1190,
  loading,
  className,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= mobileBreakpoint;
  console.log(isMobile);

  const COLUMNS = TableList({
    market,
    pairs,
    onExit,
    onRedeem,
    isMobile,
  });

  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    searchParams: {
      searchField: 'collectionName',
    },
    loading,
  });

  return (
    <Table
      {...table}
      className={className}
      search={search}
      mobileBreakpoint={mobileBreakpoint}
    />
  );
};
