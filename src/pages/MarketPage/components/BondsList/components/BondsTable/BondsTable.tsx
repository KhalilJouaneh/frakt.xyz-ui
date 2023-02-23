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
  noDataClassName?: string;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  market,
  pairs,
  onExit,
  onRedeem,
  mobileBreakpoint = 1190,
  noDataClassName,
  loading,
  className,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= mobileBreakpoint;

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
      searchField: ['collateralBox.nft.name'],
    },
    loading,
  });

  return (
    <Table
      {...table}
      search={search}
      className={className}
      noDataClassName={noDataClassName}
      mobileBreakpoint={mobileBreakpoint}
    />
  );
};
