import { stringify } from '@frakt/utils/state';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const LIMIT = 20;

export const useRaffleInfo = (params: {
  url: string;
  id: string;
  queryData: any;
}): {
  data: InfiniteData<{ pageParam: number; data: any[] }>;
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

  const { url: baseUrl, id, queryData } = params;
  const queryString = stringify(queryData);

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    queryString,
  }: {
    pageParam: number;
    queryString: string;
  }) => {
    const data = await (
      await fetch(
        `${baseUrl}&${queryString}&limit=${LIMIT}&skip=${LIMIT * pageParam}`,
      )
    ).json();

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    [id],
    ({ pageParam = 0 }) => fetchData({ pageParam, queryString }),
    {
      enabled: !!publicKey,
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
      },
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
    },
  );

  useEffect(() => {
    refetch();
  }, [queryString]);

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  };
};
