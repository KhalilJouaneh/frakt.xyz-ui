import { commonActions } from './../../../../state/common/actions';
import { useState, useMemo, Dispatch, SetStateAction, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  FetchData,
  useInfinityScroll,
} from '../../../../components/InfinityScroll';
import { useDispatch, useSelector } from 'react-redux';
import { loansActions } from '../../../../state/loans/actions';
import { BorrowNft } from '../../../../state/loans/types';
import { selectBorrowNfts } from '../../../../state/loans/selectors';

export const useBorrowNft = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: BorrowNft[];
  loading: boolean;
  searchItems: (search: string) => void;
  setSearch: (searchStr: string) => void;
  next: () => void;
  search: string;
  fetchData: FetchData<BorrowNft>;
  onSelect: (nft: BorrowNft) => void;
  onMultiSelect: (nft: BorrowNft) => void;
  selectedNfts: BorrowNft[];
  onDeselect: (nft?: BorrowNft) => void;
  setSelectedNfts: Dispatch<SetStateAction<BorrowNft[]>>;
  connected: boolean;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [nftsLoading, setNftsLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const dispatch = useDispatch();

  const fetchData: FetchData<BorrowNft> = async ({
    offset,
    limit,
    searchStr,
  }) => {
    try {
      const URL = `https://${process.env.BACKEND_DOMAIN}/nft/meta`;
      const isSearch = searchStr ? `search=${searchStr}&` : '';

      const fullURL = `${URL}/${wallet?.publicKey?.toBase58()}?${isSearch}skip=${offset}&limit=${limit}`;
      const response = await fetch(fullURL);
      const nfts = await response.json();

      return nfts || [];
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setNftsLoading(false);
    }
  };

  const {
    next,
    search,
    setSearch,
    items: userWhitelistedNFTs,
    nextDebounced: searchItems,
  } = useInfinityScroll(
    {
      fetchData,
    },
    [wallet],
  );

  const nfts = useSelector(selectBorrowNfts);

  useEffect(() => {
    dispatch(loansActions.setBorrowNfts(userWhitelistedNFTs));
  }, [userWhitelistedNFTs, dispatch]);

  const filteredNfts = useMemo(() => {
    return (nfts || []).sort(({ name: nameA }, { name: nameB }) =>
      nameA?.localeCompare(nameB),
    );
  }, [nfts]);

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

  const onMultiSelect = (nft: BorrowNft): void => {
    dispatch(commonActions.setSelectedNftId(id));
    selectedNfts.find((selectedNft) => selectedNft?.mint === nft.mint)
      ? setSelectedNfts(
          selectedNfts.filter((selectedNft) => selectedNft?.mint !== nft.mint),
        )
      : setSelectedNfts([...selectedNfts, nft]);
  };

  useEffect(() => {
    if (!wallet.connected && selectedNfts.length) {
      setSelectedNfts([]);
    }
  }, [wallet.connected, selectedNfts, setSelectedNfts]);

  const loading = nftsLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    loading,
    setSearch,
    next,
    searchItems,
    search,
    fetchData,
    onSelect,
    onMultiSelect,
    onDeselect,
    selectedNfts,
    setSelectedNfts,
    connected: wallet.connected,
  };
};