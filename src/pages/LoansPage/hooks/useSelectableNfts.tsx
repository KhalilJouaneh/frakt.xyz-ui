import { find, propEq } from 'ramda';
import create from 'zustand';

import { Loan } from '@frakt/state/loans/types';

interface UseSelectableNftsState {
  selectedNfts: Loan[];
  setSelectedNfts: (nft: Loan[]) => void;
  currentSelectedIdx: number;
  setCurrentSelectedIdx: (idx: number) => void;
}

export const useSelectableNftsState = create<UseSelectableNftsState>((set) => ({
  selectedNfts: [],
  currentSelectedIdx: 0,
  setSelectedNfts: (nft) => set((state) => ({ ...state, selectedNfts: nft })),
  setCurrentSelectedIdx: (idx) =>
    set((state) => ({ ...state, currentSelectedIdx: idx })),
}));

export const useSelectableNfts = () => {
  const { selectedNfts, setSelectedNfts } = useSelectableNftsState();

  const isNftSelected = (nft: Loan) =>
    !!find(propEq('mint', nft.mint))(selectedNfts);

  const onNftClick = (nft: Loan) => {
    const isSelected = isNftSelected(nft);
    if (isSelected) {
      setSelectedNfts(selectedNfts.filter(({ mint }) => nft.mint !== mint));
    } else {
      setSelectedNfts([...selectedNfts, nft]);
    }
  };

  return {
    onNftClick,
    isNftSelected,
  };
};
