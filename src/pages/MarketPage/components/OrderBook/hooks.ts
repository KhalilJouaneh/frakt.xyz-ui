import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchMarketPairs, Pair } from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';
import { parseMarketOrder } from './helpers';
import { MarketOrder } from './types';

type UseMarketPairs = (props: { marketPubkey: web3.PublicKey }) => {
  pairs: Pair[];
  isLoading: boolean;
};
export const useMarketPairs: UseMarketPairs = ({ marketPubkey }) => {
  const { data, isLoading } = useQuery(
    ['marketPairs', marketPubkey.toBase58()],
    () =>
      fetchMarketPairs({
        marketPubkey,
      }),
    {
      enabled: !!marketPubkey,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    pairs: data || [],
    isLoading,
  };
};

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  sortDirection?: 'desc' | 'asc'; //? Sort by interest only
  walletOwned?: boolean;
  ltv: number;
  size: number;
  interest: number;
}) => {
  offers: MarketOrder[];
  isLoading: boolean;
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  sortDirection = 'desc',
  walletOwned = false,
  ltv,
  size,
  interest,
}) => {
  const { publicKey } = useWallet();

  const { pairs, isLoading } = useMarketPairs({
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  const offers = useMemo(() => {
    if (!pairs) return [];
    const parsedOffers = pairs
      .filter((pair) => {
        return !walletOwned || pair?.assetReceiver === publicKey?.toBase58();
      })
      .map(parseMarketOrder);

    const myOffer: MarketOrder = {
      ltv,
      size,
      interest,
      synthetic: true,
      rawData: {
        publicKey: '',
        assetReceiver: '',
        edgeSettlement: 0,
        authorityAdapter: '',
      },
    };

    const sortedOffersByInterest = [...parsedOffers, myOffer].sort(
      (a, b) => b.interest - a.interest,
    );

    return sortDirection === 'desc'
      ? sortedOffersByInterest
      : sortedOffersByInterest.reverse();
  }, [pairs, sortDirection, walletOwned, publicKey, ltv, size, interest]);

  return {
    offers,
    isLoading,
  };
};
