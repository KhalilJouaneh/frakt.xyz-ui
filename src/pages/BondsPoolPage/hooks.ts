import { useQuery } from '@tanstack/react-query';
import { BondPreview, fetchBondsPreview } from '@frakt/api/bonds';
import { web3 } from 'fbonds-core';

type UseBondsPreview = (props: { walletPublicKey?: web3.PublicKey }) => {
  bondsPreview: BondPreview[];
  isLoading: boolean;
};

export const useBondsPreview: UseBondsPreview = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['bondsPreview', walletPublicKey],
    () =>
      fetchBondsPreview({
        walletPubkey: walletPublicKey,
      }),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    bondsPreview: data || [],
    isLoading,
  };
};
