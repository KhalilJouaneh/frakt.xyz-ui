import { FC, useCallback } from 'react';

import Table, { useTable } from '@frakt/components/Table';

import { TableList } from './columns';
import { useHistory } from 'react-router-dom';
import { PATHS } from '@frakt/constants';
import { MarketPreview } from '@frakt/api/bonds';

export interface MarketTableProps {
  data: ReadonlyArray<any>;
  className?: string;
  loading?: boolean;
}

export const MarketTable: FC<MarketTableProps> = ({
  data,
  className,
  loading,
}) => {
  const history = useHistory();

  const onRowClick = useCallback(
    (dataItem: MarketPreview) => {
      history.push(`${PATHS.BOND}/${dataItem?.marketPubkey}`);
      window.scrollTo(0, 0);
    },
    [history],
  );

  const COLUMNS = TableList();
  const { table } = useTable({ data, columns: COLUMNS, onRowClick, loading });

  return <Table className={className} {...table} />;
};
