import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import {
  CollectionsListItem,
  fetchAllRaffleCollections,
} from '@frakt/api/raffle';

interface RaffleCollections {
  graceCollections: CollectionsListItem[];
  historyCollections: CollectionsListItem[];
  raffleCollections: CollectionsListItem[];
}

type useFetchAllRaffleCollections = () => {
  data: RaffleCollections;
  collectionsIsLoading: boolean;
};

export const useFetchAllRaffleCollections: useFetchAllRaffleCollections =
  () => {
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
        staleTime: 10_000,
        refetchOnWindowFocus: false,
      },
    );

    const collectionsIsLoading = isLoading || isFetching;

    return { data, collectionsIsLoading };
  };
