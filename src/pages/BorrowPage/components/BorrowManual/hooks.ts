import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { selectBorrowNfts } from '../../../../state/loans/selectors';
import { commonActions } from './../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import { useDebounce } from '../../../../hooks';
import { SortValue } from './../../hooks';
import { FETCH_LIMIT } from '../../hooks';
import { BorrowNft, fetchWalletBorrowNfts } from '@frakt/api/nft';

export const useBorrowNft = ({
  sort,
}: {
  sort: SortValue;
}): {
  nfts: BorrowNft[];
  isLoading: boolean;
  searchQuery: string;
  setSearch: (searchQuery: string) => void;
  next: () => void;
  onSelect: (nft: BorrowNft) => void;
  onMultiSelect: (nft: BorrowNft) => void;
  selectedNfts: BorrowNft[];
  onDeselect: (nft?: BorrowNft) => void;
  setSelectedNfts: Dispatch<SetStateAction<BorrowNft[]>>;
  connected: boolean;
  isCloseSidebar: boolean;
} => {
  const dispatch = useDispatch();
  const [nextData, setNextData] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const firstUpdate = useRef<boolean>(true);

  const nfts = useSelector(selectBorrowNfts);

  const [sortName, sortOrder] = sort.value.split('_');

  const { publicKey, connected } = useWallet();

  const { refetch, isLoading } = useQuery(
    ['borrowPageNfts'],
    async () =>
      await fetchWalletBorrowNfts({
        publicKey,
        limit: FETCH_LIMIT,
        offset,
        search: searchQuery,
        sortBy: sortName === 'maxLoanValue' ? 'maxLoanValue' : 'name',
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
      }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedNfts, setSelectedNfts] = useState<BorrowNft[]>([]);

  const onDeselect = (nft?: BorrowNft): void => {
    if (nft) {
      setSelectedNfts(
        selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
      );
    } else {
      setSelectedNfts([]);
    }
  };

  const onSelect = (nft: BorrowNft): void => {
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([nft]);
  };

  const id = selectedNfts.length - 1 < 0 ? 0 : selectedNfts.length;

  const isCloseSidebar = !selectedNfts.length;

  const onMultiSelect = (nft: BorrowNft): void => {
    dispatch(commonActions.setSelectedNftId(id));
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  useEffect(() => {
    if (!connected && selectedNfts.length) {
      setSelectedNfts([]);
    }
  }, [connected, selectedNfts, setSelectedNfts]);

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
  }, [sort.value]);

  useEffect(() => {
    if (reFetch) {
      refetch();
      setReFetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reFetch]);

  return {
    nfts,
    isLoading,
    searchQuery,
    setSearch,
    next,
    onSelect,
    onMultiSelect,
    onDeselect,
    selectedNfts,
    setSelectedNfts,
    connected,
    isCloseSidebar,
  };
};
