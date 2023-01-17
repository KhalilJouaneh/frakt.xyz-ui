import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';

import { fetchWalletBorrowNfts } from '@frakt/api/nft';

const FETCH_LIMIT = 15;

type SortName = 'maxLoanValue' | 'name';
type SortOrder = 'desc' | 'asc';

export const useWalletNfts = () => {
  const wallet = useWallet();

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [sortName, setSortName] = useState<SortName>('maxLoanValue');

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'walletNfts',
        wallet?.publicKey?.toBase58(),
        search,
        sortOrder,
        sortName,
        sortOrder,
      ],
      queryFn: ({ pageParam = 0 }) =>
        fetchWalletBorrowNfts({
          publicKey: wallet.publicKey,
          limit: FETCH_LIMIT,
          offset: pageParam * FETCH_LIMIT,
          search,
          sortBy: sortName,
          sortOrder: sortOrder,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        const isLastPageBlank = lastPage.length === 0;
        return !isLastPageBlank ? nextPage : null;
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: wallet.connected,
    });

  return {
    nfts: data?.pages?.flat() || [],
    initialLoading: isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    sortName,
    setSortName,
  };
};
