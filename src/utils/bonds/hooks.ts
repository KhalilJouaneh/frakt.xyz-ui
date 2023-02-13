import {
  Bond,
  fetchAllMarkets,
  fetchCertainMarket,
  fetchMarketPair,
  fetchMarketPairs,
  fetchWalletBonds,
  Market,
  Pair,
} from '@frakt/api/bonds';
import { useQuery } from '@tanstack/react-query';
import { web3 } from 'fbonds-core';
import produce from 'immer';
import create from 'zustand';

type UseMarket = (props: { marketPubkey: string }) => {
  market: Market;
  isLoading: boolean;
};
export const useMarket: UseMarket = ({ marketPubkey }) => {
  const { data, isLoading } = useQuery(
    ['market', marketPubkey],
    () =>
      fetchCertainMarket({
        marketPubkey: new web3.PublicKey(marketPubkey),
      }),
    {
      enabled: !!marketPubkey,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    market: data || null,
    isLoading,
  };
};

export const useMarkets = () => {
  const { data, isLoading } = useQuery(['markets'], () => fetchAllMarkets(), {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    markets: data || null,
    isLoading,
  };
};

interface HiddenPairsPubkeysState {
  hiddenPairsPubkeys: string[];
  hidePair: (pairPubkey: string) => void;
}
const useHiddenPairsPubkeys = create<HiddenPairsPubkeysState>((set) => ({
  hiddenPairsPubkeys: [],
  hidePair: (pairPubkey) =>
    set(
      produce((state: HiddenPairsPubkeysState) => {
        state.hiddenPairsPubkeys = [...state.hiddenPairsPubkeys, pairPubkey];
      }),
    ),
}));
type UseMarketPairs = (props: { marketPubkey: string }) => {
  pairs: Pair[];
  isLoading: boolean;
  hidePair: (pairPubkey: string) => void;
};
export const useMarketPairs: UseMarketPairs = ({ marketPubkey }) => {
  const { hiddenPairsPubkeys, hidePair } = useHiddenPairsPubkeys();

  const { data, isLoading } = useQuery(
    ['marketPairs', marketPubkey],
    () => fetchMarketPairs({ marketPubkey: new web3.PublicKey(marketPubkey) }),
    {
      enabled: !!marketPubkey,
      staleTime: 30 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  );

  return {
    pairs:
      data?.filter(
        ({ publicKey }) => !hiddenPairsPubkeys.includes(publicKey),
      ) || [],
    isLoading,
    hidePair,
  };
};

type UseMarketPair = (props: { pairPubkey: string }) => {
  pair: Pair | null;
  isLoading: boolean;
};
export const useMarketPair: UseMarketPair = ({ pairPubkey }) => {
  const { data, isLoading } = useQuery(
    ['pair', pairPubkey],
    () => fetchMarketPair({ pairPubkey: new web3.PublicKey(pairPubkey) }),
    {
      enabled: !!pairPubkey,
      staleTime: 5 * 1000, //? 30sec
      refetchOnWindowFocus: false,
    },
  );

  return {
    pair: data || null,
    isLoading,
  };
};

interface HiddenBondsPubkeysState {
  hiddenBondsPubkeys: string[];
  hideBond: (bondPubkey: string) => void;
}
const useHiddenBondsPubkeys = create<HiddenBondsPubkeysState>((set) => ({
  hiddenBondsPubkeys: [],
  hideBond: (bondPubkey) =>
    set(
      produce((state: HiddenBondsPubkeysState) => {
        state.hiddenBondsPubkeys = [...state.hiddenBondsPubkeys, bondPubkey];
      }),
    ),
}));
type UseWalletBonds = (props: {
  walletPubkey: web3.PublicKey;
  marketPubkey: web3.PublicKey;
}) => {
  bonds: Bond[];
  isLoading: boolean;
  hideBond: (bondPubkey: string) => void;
};
export const useWalletBonds: UseWalletBonds = ({
  walletPubkey,
  marketPubkey,
}) => {
  const { hiddenBondsPubkeys, hideBond } = useHiddenBondsPubkeys();

  const { data, isLoading } = useQuery(
    ['walletBonds', walletPubkey?.toBase58(), marketPubkey?.toBase58()],
    () => fetchWalletBonds({ walletPubkey, marketPubkey }),
    {
      enabled: !!walletPubkey && !!marketPubkey,
      staleTime: 60 * 1000, //? 1 min
      refetchOnWindowFocus: false,
    },
  );

  return {
    bonds:
      data?.filter(
        ({ fbond }) => !hiddenBondsPubkeys.includes(fbond?.publicKey),
      ) || [],
    isLoading,
    hideBond,
  };
};
