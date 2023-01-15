import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { sum, map } from 'lodash';
import { web3 } from 'fbonds-core';

import { fetchWalletBorrowNfts } from '@frakt/api/nft';
import { useState } from 'react';

export const useBorrowRootPage = () => {
  const wallet = useWallet();
  const { maxBorrowValue, isLoading: maxBorrowValueLoading } =
    useMaxBorrowValue({ walletPublicKey: wallet?.publicKey });

  const [borrowValue, setBorrowValue] = useState<string>('');
  const [borrowPercentValue, setBorrowPercentValue] = useState<number>(0);

  const onBorrowPercentChange = (nextValue: number) => {
    const depositValue =
      ((nextValue * maxBorrowValue) / 100)?.toFixed(2) || '0';
    setBorrowValue(depositValue);
    setBorrowPercentValue(nextValue);
  };

  const onBorrowValueChange = (nextValue: string) => {
    setBorrowValue(nextValue);

    const balancePercent = (parseFloat(nextValue) / maxBorrowValue) * 100;

    if (balancePercent > 100) {
      return setBorrowPercentValue(100);
    }
    if (balancePercent < 0) {
      return setBorrowPercentValue(0);
    }

    return setBorrowPercentValue(balancePercent);
  };

  const isNotEnoughBalanceError =
    parseFloat(borrowValue) > parseFloat(maxBorrowValue.toFixed(2));

  return {
    borrowValue,
    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,
    maxBorrowValue,
    loading: maxBorrowValueLoading,
    isNotEnoughBalanceError,
  };
};

type UseMaxBorrowValue = (props: { walletPublicKey?: web3.PublicKey }) => {
  maxBorrowValue: number;
  isLoading: boolean;
};
export const useMaxBorrowValue: UseMaxBorrowValue = ({ walletPublicKey }) => {
  const { data, isLoading } = useQuery(
    ['borrowNfts', walletPublicKey?.toBase58()],
    //TODO: Replace with normal query
    async () => {
      const walletNfts = await fetchWalletBorrowNfts({
        publicKey: walletPublicKey,
        limit: 1000,
        offset: 0,
      });

      return sum(map(walletNfts, ({ maxLoanValue }) => maxLoanValue)) || 0;
    },
    {
      enabled: !!walletPublicKey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    maxBorrowValue: data || 0,
    isLoading,
  };
};
