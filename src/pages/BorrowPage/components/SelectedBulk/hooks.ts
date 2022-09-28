import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { sum, map } from 'ramda';

import { useSelectLayout } from '../../../../components/SelectLayout';
import { BorrowNft } from '../../../../state/loans/types';

type UseSeletedBulk = (props: { rawselectedBulk: any }) => {
  selectedBulk: any;
  isAssetsMode: boolean;
  setIsAssetsMode: Dispatch<SetStateAction<boolean>>;
  setSelectedBulk: Dispatch<any>;
  borrowedValue: number;
  removedNft: BorrowNft[];
  isDisabled: boolean;
  selectedBulkValue: number;
  selectedNfts: BorrowNft[];
  onMultiSelect: (nft: BorrowNft) => void;
  setSelectedNfts: Dispatch<SetStateAction<BorrowNft[]>>;
};

export const useSeletedBulk: UseSeletedBulk = ({ rawselectedBulk }) => {
  const [selectedBulk, setSelectedBulk] = useState(rawselectedBulk);
  const [isAssetsMode, setIsAssetsMode] = useState<boolean>(false);
  const [borrowedValue, setBorrowedValue] = useState<number>(0);
  const [removedNft, setRemovedNft] = useState<BorrowNft[]>([]);

  const { onMultiSelect, setSelectedNfts, selectedNfts } = useSelectLayout();

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
  const selectedBulkValue = sum(map(maxLoanValue, selectedBulk));

  const isDisabled = selectedBulk.length === selectedNfts.length;

  useEffect(() => {
    setRemovedNft(
      selectedBulk.filter(
        (selectedBulkMint) =>
          !selectedNfts.find(
            (selectedNftMint) => selectedNftMint.mint === selectedBulkMint.mint,
          ),
      ),
    );
  }, [selectedNfts]);

  useEffect(() => {
    const borrowValueSelectedNft = sum(map(maxLoanValue, selectedNfts));
    setBorrowedValue(selectedBulkValue - borrowValueSelectedNft);
  }, [selectedNfts]);

  return {
    selectedBulk,
    isAssetsMode,
    setIsAssetsMode,
    borrowedValue,
    removedNft,
    isDisabled,
    setSelectedBulk,
    selectedBulkValue,
    selectedNfts,
    onMultiSelect,
    setSelectedNfts,
  };
};
