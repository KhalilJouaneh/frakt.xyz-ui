import { ColumnsType } from 'antd/es/table';

import { Bond } from '@frakt/api/bonds';

import {
  ExperationCell,
  TitleCell,
  SizeCell,
  InterestCell,
  ProfitCell,
  HeaderTitleCell,
  PnlProfitCell,
  ButtontsCell,
} from './TableCells';

export const TableList = ({ market, pairs, onExit, onRedeem }) => {
  const COLUMNS: ColumnsType<Bond> = [
    {
      key: 'nftName',
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          label="Collateral"
          value="nftName"
        />
      ),
      dataIndex: 'nftName',
      sorter: (a, b) =>
        b?.collateralBox.nft.name?.localeCompare(a?.collateralBox.nft.name),
      render: (_, bond: Bond) => <TitleCell bond={bond} />,
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
    },
    {
      key: 'size',
      dataIndex: 'size',
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          label="Size"
          value="size"
          tooltipText="Amount of SOL you want to lend for a specific collection at the chosen LTV & APY"
        />
      ),
      sorter: (
        { amountOfUserBonds: amountOfUserBondsA = 0 },
        { amountOfUserBonds: amountOfUserBondsB = 0 },
      ) => amountOfUserBondsA - amountOfUserBondsB,
      render: (_, bond: Bond) => <SizeCell bond={bond} />,
      showSorterTooltip: false,
    },
    {
      key: 'interest',
      dataIndex: 'interest',
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          label="Interest"
          value="interest"
          tooltipText="Interest (in %) for the duration of this loan"
        />
      ),
      render: (_, bond: Bond) => {
        return <InterestCell bond={bond} />;
      },
      showSorterTooltip: false,
    },
    {
      key: 'expiration',
      dataIndex: 'expiration',
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          label="Expiration"
          value="expiration"
          tooltipText="When the loan is paid back® or liquidated"
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
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          value="Profit"
          label="Est. Profit"
          tooltipText="Analyzed profit from repaying the loan"
        />
      ),
      render: (_, bond: Bond) => <ProfitCell bond={bond} />,
    },
    {
      key: 'pnl',
      dataIndex: 'pnl',
      title: ({ sortColumns }) => (
        <HeaderTitleCell
          sortColumns={sortColumns}
          value="pnl"
          label="PNL"
          tooltipText="Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)"
        />
      ),
      render: (_, bond: Bond) => (
        <PnlProfitCell bond={bond} market={market} pairs={pairs} />
      ),
    },
    {
      render: (_, bond: Bond) => {
        return (
          <ButtontsCell
            onExit={onExit}
            onRedeem={onRedeem}
            bond={bond}
            market={market}
            pairs={pairs}
          />
        );
      },
    },
  ];

  return COLUMNS;
};
