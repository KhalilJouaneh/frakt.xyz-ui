import { useQuery } from '@tanstack/react-query';
import { MarketPreview, fetchMarketsPreview } from '@frakt/api/bonds';
import { Tab, useTabs } from '@frakt/components/Tabs';
import { web3 } from 'fbonds-core';

type UseMarketsPreview = (props: { walletPublicKey?: web3.PublicKey }) => {
  marketsPreview: MarketPreview[];
  isLoading: boolean;
};

export const useMarketsPreview: UseMarketsPreview = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['marketsPreview', walletPublicKey],
    () =>
      fetchMarketsPreview({
        walletPubkey: walletPublicKey,
      }),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    marketsPreview: data || [],
    isLoading,
  };
};

export enum MarketTabsNames {
  COLLECTIONS = 'collections',
  OFFERS = 'offers',
  BONDS = 'bonds',
}

export const useMarketPage = () => {
  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: MARKET_TABS,
    defaultValue: MARKET_TABS[0].value,
  });

  return {
    marketTabs,
    tabValue,
    setTabValue,
  };
};

export const MARKET_TABS: Tab[] = [
  {
    label: 'Collections',
    value: 'collections',
  },
  {
    label: 'My bonds',
    value: 'bonds',
  },
];
