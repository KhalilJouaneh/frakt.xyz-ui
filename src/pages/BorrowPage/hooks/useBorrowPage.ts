import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { useDispatch, useSelector } from 'react-redux';
import { Control } from 'react-hook-form';
import { loansActions } from '../../../state/loans/actions';
import { BorrowNft } from '../../../state/loans/types';
import { selectBorrowNfts } from '../../../state/loans/selectors';
import { useDebounce } from '../../../hooks';
import {
  FilterFormFieldsValues,
  useBorrowPageFilter,
} from './useBorrowPageFilter';
import { FETCH_LIMIT } from '../BorrowPage.constants';

export const useBorrowPage = (): {
  nfts: BorrowNft[];
  isLoading: boolean;
  searchQuery: string;
  setSearch: (searchQuery: string) => void;
  next: () => void;
  control: Control<FilterFormFieldsValues>;
} => {
  const dispatch = useDispatch();
  const [nextData, setNextData] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const firstUpdate = useRef<boolean>(true);

  const nfts = useSelector(selectBorrowNfts);

  const { control, sortValue } = useBorrowPageFilter();
  const [sortName, sortOrder] = sortValue.split('_');

  const { publicKey, connected } = useWallet();

  const { refetch, isLoading } = useQuery(
    ['borrowPageNfts'],
    async () => {
      const URL = `https://${process.env.BACKEND_DOMAIN}/nft/meta`;
      const isSearch = searchQuery ? `search=${searchQuery}&` : '';
      const response = await fetch(
        `${URL}/${publicKey?.toBase58()}?${isSearch}skip=${offset}&limit=${FETCH_LIMIT}&sortBy=${sortName}&sort=${sortOrder}`,
      );
      return await response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: connected,
      onSuccess: (data) => {
        if (nextData) {
          dispatch(loansActions.setBorrowNfts([...nfts, ...data]));
          setNextData(false);
        } else {
          dispatch(loansActions.setBorrowNfts(data));
        }
      },
    },
  );

  const clearAndFetch = () => {
    setOffset(0);
    setReFetch(true);
  };

  const debouncedReFetch = useDebounce(() => {
    clearAndFetch();
  }, 500);

  const setSearch = useCallback((searchQuery: string): void => {
    setSearchQuery(searchQuery);
    debouncedReFetch();
  }, []);

  const next = useCallback((): void => {
    setOffset((prevValue) => prevValue + FETCH_LIMIT);
    setNextData(true);
    setReFetch(true);
  }, []);

  useLayoutEffect(() => {
    if (!firstUpdate.current) {
      clearAndFetch();
    }
    firstUpdate.current = false;
  }, [sortValue]);

  useEffect(() => {
    if (reFetch) {
      refetch();
      setReFetch(false);
    }
  }, [reFetch]);

  return {
    nfts,
    isLoading,
    searchQuery,
    setSearch,
    next,
    control,
  };
};
