import { useState, useMemo, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useDispatch, useSelector } from 'react-redux';
import { loansActions } from '../../../state/loans/actions';
import { BorrowNft } from '../../../state/loans/types';
import { selectBorrowNfts } from '../../../state/loans/selectors';
import { useDebounce } from '../../../hooks';

export const useBorrowPage = (): {
  nfts: BorrowNft[];
  isLoading: boolean;
  searchQuery: string;
  setSearch: (searchQuery: string) => void;
  next: () => void;
} => {
  const dispatch = useDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const wallet = useWallet();
  const fetchOnlyConnectedWallet: boolean = wallet?.connected;

  const LIMIT = 10;

  const { refetch, isLoading } = useQuery(
    ['borrowPageNfts'],
    async () => {
      const URL = `https://${process.env.BACKEND_DOMAIN}/nft/meta`;
      const isSearch = searchQuery ? `search=${searchQuery}&` : '';
      const response = await fetch(
        `${URL}/${wallet?.publicKey?.toBase58()}?${isSearch}skip=${offset}&limit=${LIMIT}`,
      );
      return await response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!fetchOnlyConnectedWallet,
      onSuccess: (data) => {
        if (isSearch) {
          dispatch(loansActions.setBorrowNfts(data));
          setIsSearch(false);
        } else {
          dispatch(loansActions.setBorrowNfts([...nfts, ...data]));
        }
      },
    },
  );

  const debouncedReFetch = useDebounce(() => {
    setOffset(0);
    setReFetch(true);
    setIsSearch(true);
  }, 500);

  const setSearch = useCallback((searchQuery: string): void => {
    setSearchQuery(searchQuery);
    debouncedReFetch();
  }, []);

  const next = useCallback((): void => {
    setOffset((prevValue) => prevValue + LIMIT);
    setReFetch(true);
  }, []);

  useEffect(() => {
    if (reFetch) {
      refetch();
      setReFetch(false);
    }
  }, [reFetch]);

  useEffect(() => {
    if (fetchOnlyConnectedWallet) {
      dispatch(loansActions.setBorrowNfts([]));
    }
  }, [fetchOnlyConnectedWallet]);

  const nfts = useSelector(selectBorrowNfts);

  const filteredNfts = useMemo(() => {
    return (nfts || []).sort(({ name: nameA }, { name: nameB }) =>
      nameA?.localeCompare(nameB),
    );
  }, [nfts]);

  return {
    nfts: filteredNfts,
    isLoading,
    searchQuery,
    setSearch,
    next,
  };
};
