import { LotteryTickets } from './../../api/raffle/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import {
  CollectionsListItem,
  fetchAllRaffleCollections,
  fetchUserTickets,
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

type UseFetchUserTickets = () => {
  lotteryTickets: LotteryTickets;
  userTicketsIsLoading: boolean;
};

export const useFetchUserTickets: UseFetchUserTickets = () => {
  const { publicKey } = useWallet();

  const {
    data: lotteryTickets,
    isLoading,
    isFetching,
  }: {
    data: LotteryTickets;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchUserTickets'],
    () => fetchUserTickets(publicKey?.toBase58()),
    {
      enabled: !!publicKey,
      staleTime: 10_000,
      refetchOnWindowFocus: false,
    },
  );

  const userTicketsIsLoading = isLoading || isFetching;

  return { lotteryTickets, userTicketsIsLoading };
};
