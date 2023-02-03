import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { parseMarketOrder } from './helpers';
import { MarketOrder } from './types';
import { useMarketPairs } from '@frakt/utils/bonds';

type UseMarketOrders = (props: {
  marketPubkey: web3.PublicKey;
  sortDirection?: 'desc' | 'asc'; //? Sort by interest only
  walletOwned?: boolean;
  ltv: number;
  size: number;
  apr: number;
}) => {
  offers: MarketOrder[];
  isLoading: boolean;
  offersExist: boolean;
};

export const useMarketOrders: UseMarketOrders = ({
  marketPubkey,
  sortDirection = 'desc',
  walletOwned = false,
  ltv,
  size,
  apr,
}) => {
  const { publicKey } = useWallet();

  const { pairs, isLoading } = useMarketPairs({
    marketPubkey: marketPubkey?.toBase58(),
  });

  const offers = useMemo(() => {
    if (!pairs) return [];
    const myOffer: MarketOrder = {
      ltv,
      size,
      apr,
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

    const sortOffersByApr = parsedOffers.sort((a, b) => b.apr - a.apr);

    return sortDirection === 'asc'
      ? sortOffersByApr
      : sortOffersByApr.reverse();
  }, [pairs, sortDirection, walletOwned, publicKey, ltv, size, apr]);

  const offersExist = Boolean(offers.length);

  return {
    offersExist,
    offers,
    isLoading,
  };
};
