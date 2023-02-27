import { ColumnsType, ColumnType } from 'antd/es/table';
import { SortOrder } from 'antd/lib/table/interface';

import { Bond, Market, Pair } from '@frakt/api/bonds';

import {
  ExperationCell,
  TitleCell,
  SizeCell,
  InterestCell,
  ProfitCell,
  HeaderTitleCell,
  PnlProfitCell,
  ButtontsCell,
  calcEstimateProfit,
  calcPnlProfit,
} from './TableCells';
import { useState } from 'react';

export type SortColumns = {
  column: ColumnType<Bond>;
  order: SortOrder;
}[];

export const TableList = ({ data, isMobile, hideBond }) => {
  const [currentMarketAndPairs, setCurrentMarketAndPairs] = useState<{
    market: Market;
    pairs: Pair[];
  }>(null);

  const COLUMNS: ColumnsType<Bond> = [
    {
      key: 'nftName',
      dataIndex: 'nftName',
      title: (column) => (
        <HeaderTitleCell
          isMobile={isMobile}
          sortColumns={column?.sortColumns}
          label="Collateral"
          value="nftName"
          fixedLeft
        />
      ),
      sorter: (a, b) =>
        b?.collateralBox.nft.name?.localeCompare(a?.collateralBox.nft.name),
      render: (_, bond: Bond) => <TitleCell isMobile={isMobile} bond={bond} />,
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
    },
    {
      key: 'size',
      dataIndex: 'size',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Size"
          value="size"
          tooltipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
        />
      ),
      sorter: (
        { amountOfUserBonds: amountOfUserBondsA = 0 },
        { amountOfUserBonds: amountOfUserBondsB = 0 },
      ) => amountOfUserBondsA - amountOfUserBondsB,
      render: (_, bond: Bond) => <SizeCell isMobile={isMobile} bond={bond} />,
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Interest"
          value="interest"
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),

      render: (_, bond: Bond) => (
        <InterestCell isMobile={isMobile} bond={bond} />
      ),
      sorter: (a, b) => a.interest - b.interest,
      showSorterTooltip: false,
    },
    {
      key: 'expiration',
      dataIndex: 'expiration',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          label="Expiration"
          value="expiration"
          tooltipText="When the loan is paid back or liquidated"
        />
      ),
      render: (_, bond: Bond) => <ExperationCell bond={bond} />,
      sorter: ({ fbond: fbondA }, { fbond: fbondB }) =>
        fbondA.liquidatingAt - fbondB.liquidatingAt,
      showSorterTooltip: false,
    },
    {
      key: 'profit',
      dataIndex: 'profit',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          value="profit"
          label="Est. Profit"
          tooltipText="Analyzed profit from repaying the loan"
        />
      ),
      sorter: (a, b) => calcEstimateProfit(a) - calcEstimateProfit(b),
      render: (_, bond: Bond) => <ProfitCell bond={bond} />,
      showSorterTooltip: false,
    },
    {
      key: 'pnl',
      dataIndex: 'pnl',
      title: (column) => (
        <HeaderTitleCell
          sortColumns={column?.sortColumns}
          value="pnl"
          label="PNL"
          tooltipText="Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)"
        />
      ),
      sorter: (a, b) => {
        return (
          calcPnlProfit({
            bond: a,
            market: currentMarketAndPairs?.market,
            pairs: currentMarketAndPairs?.pairs,
          }) -
          calcPnlProfit({
            bond: b,
            market: currentMarketAndPairs?.market,
            pairs: currentMarketAndPairs?.pairs,
          })
        );
      },
      render: (_, bond: Bond) => (
        <PnlProfitCell
          inMobile={isMobile}
          setCurrentMarketAndPairs={setCurrentMarketAndPairs}
          bond={bond}
        />
      ),
      showSorterTooltip: false,
    },
    {
      render: (_, bond: Bond) => {
        return (
          <ButtontsCell
            bonds={data}
            hideBond={hideBond}
            bond={bond}
            isMobile={isMobile}
          />
        );
      },
    },
  ];

  return COLUMNS;
};
