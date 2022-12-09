import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import create from 'zustand';

import {
  CollectionsListItem,
  fetchAllRaffleCollections,
} from '@frakt/api/raffle';

interface RaffleCollections {
  graceCollections: CollectionsListItem[];
  historyCollections: CollectionsListItem[];
  raffleCollections: CollectionsListItem[];
}

interface RaffleCollectionsState {
  setCollections: (value: RaffleCollections) => void;
  collections: RaffleCollections;
}

export const useFetchAllRaffleCollections = (): void => {
  const { publicKey } = useWallet();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: RaffleCollections;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchAllRaffleCollections'],
    () => fetchAllRaffleCollections(),
    {
      enabled: !!publicKey,
    },
  );

  const collectionsIsLoading = isLoading || isFetching;

  const { setCollections } = useRaffleCollections();

  useEffect(() => {
    setCollections(data);
  }, [data, collectionsIsLoading]);
};

export const useRaffleCollections = create<RaffleCollectionsState>((set) => ({
  collections: null,
  setCollections: (nextValue) =>
    set((state) => ({ ...state, collections: nextValue })),
}));
