import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { harvestLiquidity as harvestTxn } from '../../utils/loans';
import { useConnection, useDebounce } from '../../hooks';
import { Tab, useTabs } from '../../components/Tabs';

export enum LoanTabsNames {
  LENDING = 'lending',
  LIQUIDATIONS = 'liquidations',
  LOANS = 'loans',
}

export interface LoansPoolInfo {
  apr?: number;
  loans?: number;
  totalSupply?: number;
  depositAmount?: number;
  utilizationRate?: number;
  rewardAmount?: number;
  totalBorrowed?: number;
}

export const useLoansPage = (): {
  loanTabs: Tab[];
  tabValue: string;
  setTabValue: (value: string) => void;
  searchItems: (value?: string) => void;
  harvestLiquidity: () => void;
} => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LOANS_TABS,
    defaultValue: LOANS_TABS[0].value,
  });
  const [, setSearchString] = useState<string>('');

  const LOAN_POOL_PUBKEY = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const harvestLiquidity = async (): Promise<void> => {
    await harvestTxn({
      connection,
      wallet,
      liquidityPool: LOAN_POOL_PUBKEY,
    });
  };

  return {
    searchItems,
    loanTabs,
    tabValue,
    setTabValue,
    harvestLiquidity,
  };
};

const LOANS_TABS: Tab[] = [
  {
    label: 'Lending',
    value: 'lending',
  },
  {
    label: 'Liquidations',
    value: 'liquidations',
    disabled: true,
  },
  {
    label: 'My loans',
    value: 'loans',
  },
];
