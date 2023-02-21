import { FC } from 'react';

import Table, { useTable } from '@frakt/components/Table';

import { TableList } from './columns';

export interface MarketTableProps {
  data: ReadonlyArray<any>;
}

export const MarketTable: FC<MarketTableProps> = ({ data }) => {
  const COLUMNS = TableList();

  const { table } = useTable({ data, columns: COLUMNS });

  return <Table {...table} />;
};
