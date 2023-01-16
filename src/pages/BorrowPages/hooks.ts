import create from 'zustand';
import produce from 'immer';

import { BorrowNftBulk } from '@frakt/api/nft';

interface SelectedNftsState {
  selection: BorrowNftBulk[];
  setSelection: (bulkSelection: BorrowNftBulk[]) => void;
  clearSelection: () => void;
}

export const useSelectedNfts = create<SelectedNftsState>((set) => ({
  selection: [],
  setSelection: (bulkSelection) =>
    set(
      produce((state: SelectedNftsState) => {
        state.selection = bulkSelection;
      }),
    ),
  clearSelection: () =>
    set(
      produce((state: SelectedNftsState) => {
        state.selection = [];
      }),
    ),
}));
