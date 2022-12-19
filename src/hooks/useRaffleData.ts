import { useState } from 'react';
import { stringify } from '@frakt/utils/state';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { FetchItemsParams } from '@frakt/api/raffle';

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
