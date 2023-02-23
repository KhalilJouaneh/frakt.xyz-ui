import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { parseMarketOrder } from './helpers';
import { MarketOrder } from './types';
import { useMarketPairs } from '@frakt/utils/bonds';
import { compareNumbers } from '@frakt/utils';

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  sortDirection?: 'desc' | 'asc'; //? Sort by interest only
  walletOwned?: boolean;
  ltv: number;
  size: number; //? lamports
  interest: number;
  duration: number;
}) => {
  offers: MarketOrder[];
  isLoading: boolean;
  offersExist: boolean;
  hidePair: (pairPubkey: string) => void;
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  sortDirection = 'desc',
  walletOwned = false,
  ltv,
  size,
  interest,
  duration,
}) => {
  const { publicKey } = useWallet();

  const { pairs, isLoading, hidePair } = useMarketPairs({
    marketPubkey: marketPubkey?.toBase58(),
  });

  const offers = useMemo(() => {
    if (!pairs) return [];
    const myOffer: MarketOrder = {
      ltv,
      size: size / 1e9,
      interest: interest / 1e2,
      duration: duration ?? 7,
      synthetic: true,
      rawData: {
        publicKey: '',
        assetReceiver: '',
        edgeSettlement: 0,
        authorityAdapter: '',
      },
    };

    const parsedOffers = pairs
      .filter((pair) => {
        return !walletOwned || pair?.assetReceiver === publicKey?.toBase58();
      })
      .map(parseMarketOrder);

    if (ltv) parsedOffers.push(myOffer);
    const sortOffersByInterest = parsedOffers.sort((a, b) => {
      return compareNumbers(a.interest, b.interest, sortDirection === 'desc');
    });

    const sortedByLtv = (
      sortDirection === 'asc'
        ? sortOffersByInterest
        : sortOffersByInterest.reverse()
    ).sort((a, b) => compareNumbers(a.ltv, b.ltv, sortDirection === 'desc'));

    return sortedByLtv;
  }, [pairs, sortDirection, walletOwned, publicKey, ltv, size, interest]);

  const offersExist = Boolean(offers.length);

  return {
    offersExist,
    offers,
    isLoading,
    hidePair,
  };
};
