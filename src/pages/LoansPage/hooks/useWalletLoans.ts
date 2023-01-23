import { web3 } from 'fbonds-core';
import { useQuery } from '@tanstack/react-query';

import { fetchWalletLoans, Loan } from '@frakt/api/loans';

type UseWalletLoans = (props: { walletPublicKey?: web3.PublicKey }) => {
  loans: Loan[];
  isLoading: boolean;
};

export const useWalletLoans: UseWalletLoans = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['walletLoans', walletPublicKey?.toBase58()],
    () =>
      fetchWalletLoans({
        publicKey: new web3.PublicKey(walletPublicKey),
      }),
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: 15 * 1000,
    },
  );

  return {
    loans: data || [],
    isLoading,
  };
};
