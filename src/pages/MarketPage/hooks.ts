import { useQuery } from '@tanstack/react-query';
import { fetchCertainMarket, Market } from '@frakt/api/bonds';
import { web3 } from 'fbonds-core';

type UseMarket = (props: { marketPubkey: web3.PublicKey }) => {
  market: Market;
  isLoading: boolean;
};

export const useMarket: UseMarket = ({ marketPubkey }) => {
  const { data, isLoading } = useQuery(
    ['market', marketPubkey],
    () =>
      fetchCertainMarket({
        marketPubkey: marketPubkey,
      }),
    {
      enabled: !!marketPubkey,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    market: data || null,
    isLoading,
  };
};
