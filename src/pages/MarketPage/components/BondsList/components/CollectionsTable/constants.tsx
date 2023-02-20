import { ColumnsType } from 'antd/es/table';

import {
  CreateButtonsJSX,
  ExperationCell,
  InterestCell,
  SizeAmountCell,
  TitleCell,
  TitleWithTooltip,
} from './tableRowsJSXBuilders';
import { Bond } from '@frakt/api/bonds';

export const TableList = ({ market, pairs, onExit, onRedeem }) => {
  const COLUMNS: ColumnsType<Bond> = [
    {
      key: 'nftName',
      title: 'Collateral name',
      dataIndex: 'nftName',
      sorter: (a, b) =>
        b?.collateralBox.nft.name?.localeCompare(a?.collateralBox.nft.name),
      render: (_, record: Bond): JSX.Element => (
        <TitleCell
          imgSrc={record?.collateralBox.nft.imageUrl}
          title={record?.collateralBox.nft.name}
        />
      ),
      defaultSortOrder: 'descend',
    },
    {
      key: 'size',
      title: () => (
        <TitleWithTooltip
          label="Size"
          text="Interest (in %) for the duration of this loan"
        />
      ),
      dataIndex: 'size',
      sorter: (
        { amountOfUserBonds: amountOfUserBondsA = 0 },
        { amountOfUserBonds: amountOfUserBondsB = 0 },
      ) => amountOfUserBondsA - amountOfUserBondsB,
      render: (_, bond: Bond) => {
        return <SizeAmountCell bond={bond} />;
      },
    },
    {
      key: 'interest',
      title: () => (
        <TitleWithTooltip
          label="interest"
          text="Interest (in %) for the duration of this loan"
        />
      ),
      dataIndex: 'interest',
      render: (_, bond: Bond) => {
        return <InterestCell bond={bond} />;
      },
    },
    {
      key: 'expiration',
      title: () => (
        <TitleWithTooltip
          label="Expiration"
          text="When the loan is paid back or liquidated"
        />
      ),
      dataIndex: 'expiration',
      render: (_, bond: Bond) => {
        return <ExperationCell bond={bond} />;
      },
      sorter: ({ fbond: fbondA }, { fbond: fbondB }) =>
        fbondA.liquidatingAt - fbondB.liquidatingAt,
    },
    {
      key: 'profit',
      title: () => (
        <TitleWithTooltip
          label="Est. Profit"
          text="Analyzed profit from repaying the loan"
        />
      ),
      dataIndex: 'profit',
      render: (_, bond: Bond) => {
        return <SizeAmountCell bond={bond} />;
      },
    },
    {
      key: 'pnl',
      title: () => (
        <TitleWithTooltip
          label="PNL"
          text="Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)"
        />
      ),
      dataIndex: 'pnl',
      render: (_, bond: Bond) => {
        return <SizeAmountCell bond={bond} />;
      },
    },
    {
      render: (_, bond: Bond) => {
        return (
          <CreateButtonsJSX
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
