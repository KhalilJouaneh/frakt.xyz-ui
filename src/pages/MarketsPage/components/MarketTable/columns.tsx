import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';
import { map, sum } from 'lodash';

import { Search } from '@frakt/components/Table/Search';
import { MarketPreview } from '@frakt/api/bonds';

import {
  TitleCell,
  HeaderTitleCell,
  createOfferTvlJSX,
  createBestOfferJSX,
  createDurationJSX,
  createAprJSX,
  createSolValueJSX,
  createHighestLtvJSX,
  createActiveLoansJSX,
} from './TableCells';
import styles from './TableCells/TableCells.module.scss';

export type SortColumns = {
  column: ColumnType<MarketPreview>;
  order: SortOrder;
}[];

export const TableList = ({ onChange }) => {
  const COLUMNS: ColumnsType<MarketPreview> = [
    {
      key: 'collectionName',
      dataIndex: 'collectionName',
      title: () => (
        <Search
          placeHolderText="Search by name"
          className={styles.searchInput}
          onChange={onChange}
        />
      ),
      render: (_, market: MarketPreview) => <TitleCell market={market} />,
    },
    {
      key: 'offerTVL',
      dataIndex: 'offerTVL',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Offer TVL"
          value="offerTVL"
          tooltipText="Total liquidity currently available in active offers"
        />
      ),
      sorter: (a, b) => parseFloat(a.offerTVL) - parseFloat(b.offerTVL),
      render: (value) => createOfferTvlJSX(value),
      showSorterTooltip: false,
      defaultSortOrder: 'descend',
    },
    {
      key: 'bestOffer',
      dataIndex: 'bestOffer',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Best offer"
          value="bestOffer"
          tooltipText="Highest loan amount offered for that collection"
        />
      ),
      sorter: (a, b) => a.bestOffer - b.bestOffer,
      render: (value) => createBestOfferJSX(value),
      showSorterTooltip: false,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Duration"
          value="duration"
        />
      ),
      sorter: (a, b) => sum(map(a.duration)) - sum(map(b.duration)),
      render: (value) => createDurationJSX(value),
      showSorterTooltip: false,
    },
    {
      key: 'activeLoans',
      dataIndex: 'activeLoans',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Active loans"
          value="activeLoans"
        />
      ),
      render: (value) => createActiveLoansJSX(value),
      sorter: (a, b) => parseFloat(a.offerTVL) - parseFloat(b.offerTVL),
      showSorterTooltip: false,
    },
    {
      key: 'bestLTV',
      dataIndex: 'bestLTV',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Highest LTV"
          value="bestLTV"
          tooltipText="Highest loan amount offered for that collection"
        />
      ),
      render: (value) => createHighestLtvJSX(value),
      sorter: (a, b) => a.bestLTV - b.bestLTV,
      showSorterTooltip: false,
    },
    {
      key: 'apy',
      dataIndex: 'apy',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="APR"
          value="apy"
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),
      render: (value) => createAprJSX(value),
      sorter: (a, b) => a.apy - b.apy,
      showSorterTooltip: false,
    },
  ];

  return COLUMNS;
};
