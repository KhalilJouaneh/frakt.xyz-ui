import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { stringify } from '@frakt/utils/state';
import create from 'zustand';
import produce from 'immer';
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  AuctionListItem,
  fetchAllRaffleList,
  fetchAuctionsList,
  FetchItemsParams,
  GraceListItem,
} from '@frakt/api/raffle';

const LIMIT = 20;

const baseUrl = `https://${process.env.BACKEND_DOMAIN}`;

export const useRaffleInfo = (params: {
  url: string;
  id: string;
  queryData: FetchItemsParams;
}): {
  data: any[];
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<{
      pageParam: number;
      data: any[];
    }>
  >;
  isFetchingNextPage: boolean;
  isListEnded: boolean;
} => {
  const { publicKey } = useWallet();

  const { url, id, queryData } = params;
  const queryString = stringify(queryData);

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    queryString,
  }: {
    pageParam: number;
    queryString: string;
  }) => {
    const queryUrl = `${baseUrl}/${url}${queryString}&limit=${LIMIT}&skip=${
      LIMIT * pageParam
    }`.replace('&?', '&');

    const data = await (await fetch(queryUrl)).json();

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [id, publicKey, queryData],
    ({ pageParam = 0 }) => fetchData({ pageParam, queryString }),
    {
      enabled: !!queryData,
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined;
      },
      refetchInterval: 5000,
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
      },
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
    },
  );

  const rafflesData = data?.pages?.map((page) => page.data).flat();

  return {
    data: rafflesData,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  };
};

export const useFetchAllRaffleList = () => {
  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: GraceListItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAllRaffleList'], () => fetchAllRaffleList(), {
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return { data, loading: isLoading || isFetching };
};

export const useFetchAuctionsList = () => {
  const { hiddenAuctionsPubkeys, hideAuction } = useHiddenAuctionPubkeys();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: AuctionListItem[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAuctionsList'], () => fetchAuctionsList(), {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    data:
      data?.filter(
        ({ auctionPubkey }) => !hiddenAuctionsPubkeys.includes(auctionPubkey),
      ) || [],
    loading: isLoading || isFetching,
    hideAuction,
  };
};

interface HiddenAuctionsPubkeysState {
  hiddenAuctionsPubkeys: string[];
  hideAuction: (bondPubkey: string) => void;
}
const useHiddenAuctionPubkeys = create<HiddenAuctionsPubkeysState>((set) => ({
  hiddenAuctionsPubkeys: [],
  hideAuction: (bondPubkey) =>
    set(
      produce((state: HiddenAuctionsPubkeysState) => {
        state.hiddenAuctionsPubkeys = [
          ...state.hiddenAuctionsPubkeys,
          bondPubkey,
        ];
      }),
    ),
}));
