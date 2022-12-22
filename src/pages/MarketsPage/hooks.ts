import { useQuery } from '@tanstack/react-query';
import { MarketPreview, fetchMarketsPreview } from '@frakt/api/bonds';
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
