import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';
import { useWindowSize } from '@frakt/hooks';

import { TableList } from './columns';

export interface BondsTableProps {
  data: ReadonlyArray<any>;
  mobileBreakpoint?: number;
  loading?: boolean;
  className?: string;
  noDataClassName?: string;
  hideBond?: (bondPubkey: string) => void;
  haderTitleCellClassName?: string;
}

export const BondsTable: FC<BondsTableProps> = ({
  data,
  mobileBreakpoint,
  noDataClassName,
  loading,
  className,
  hideBond,
  haderTitleCellClassName,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= mobileBreakpoint;

  const COLUMNS = TableList({
    data,
    isMobile,
    hideBond,
    className: haderTitleCellClassName,
  });

  const { table, search } = useTable({
    data,
    columns: COLUMNS,
    searchParams: {
      searchField: ['collateralBox.nft.name'],
      debounceWait: 300,
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
