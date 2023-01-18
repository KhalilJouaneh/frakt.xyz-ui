import create from 'zustand';
import produce from 'immer';

import { BorrowNft, BorrowNftSuggested } from '@frakt/api/nft';

export interface BorrowNftSelected extends BorrowNft {
  isPriceBased: boolean; //? Did user select priceBased or timeBased
  solLoanValue: number; //? Selected borrow value by user (in sidebar)
}

interface SelectedNftsState {
  selection: BorrowNftSelected[];
  setSelection: (bulkSelection: BorrowNftSelected[]) => void;
  findNftInSelection: (mint: string) => BorrowNftSelected | null;
  addNftToSelection: (nft: BorrowNftSelected) => void;
  removeNftFromSelection: (mint: string) => void;
  updateNftInSelection: (nft: BorrowNftSelected) => void;
  toggleNftInSelection: (nft: BorrowNftSelected) => void;
  clearSelection: () => void;

  highlightedNftMint: string | null;
  setHighlightedNftMint: (mint: string) => void;
  hightlightNextNftInSelection: (reverse?: boolean) => void;
  checkIsNftHighlighted: (mint: string) => boolean;
  clearHighlightedNftMint: () => void;
}

export const useSelectedNfts = create<SelectedNftsState>((set, get) => ({
  selection: [],
  setSelection: (bulkSelection) => {
    set(
      produce((state: SelectedNftsState) => {
        state.selection = bulkSelection;
      }),
    );
    const { setHighlightedNftMint } = get();
    setHighlightedNftMint(bulkSelection[0].mint);
  },
  addNftToSelection: (nft) => {
    set(
      produce((state: SelectedNftsState) => {
        state.selection.push(nft);
      }),
    );
    const { setHighlightedNftMint } = get();
    setHighlightedNftMint(nft.mint);
  },
  removeNftFromSelection: (nftMint) => {
    const {
      selection,
      checkIsNftHighlighted,
      hightlightNextNftInSelection,
      clearHighlightedNftMint,
    } = get();
    if (checkIsNftHighlighted(nftMint)) hightlightNextNftInSelection();

    if (selection.length === 1) clearHighlightedNftMint();

    set(
      produce((state: SelectedNftsState) => {
        state.selection = state.selection.filter(
          ({ mint }) => mint !== nftMint,
        );
      }),
    );
  },
  updateNftInSelection: (nft) => {
    set(
      produce((state: SelectedNftsState) => {
        const nftToReplaceIdx =
          state.selection.findIndex(({ mint }) => mint === nft.mint) ?? null;
        state.selection[nftToReplaceIdx] = nft;
      }),
    );
  },
  clearSelection: () => {
    set(
      produce((state: SelectedNftsState) => {
        state.selection = [];
      }),
    );
    const { clearHighlightedNftMint } = get();
    clearHighlightedNftMint();
  },
  findNftInSelection: (nftMint) => {
    const { selection } = get();
    return selection.find(({ mint }) => mint === nftMint) ?? null;
  },
  toggleNftInSelection: (nft) => {
    const { findNftInSelection, addNftToSelection, removeNftFromSelection } =
      get();
    const isNftInSelection = !!findNftInSelection(nft.mint);
    isNftInSelection
      ? removeNftFromSelection(nft.mint)
      : addNftToSelection(nft);
  },

  highlightedNftMint: null,
  setHighlightedNftMint: (mint: string) =>
    set(
      produce((state: SelectedNftsState) => {
        state.highlightedNftMint = mint;
      }),
    ),
  hightlightNextNftInSelection: (reverse = false) => {
    const { selection, highlightedNftMint } = get();
    if (selection.length === 0) return;
    const currenHighlightedNftIdx =
      selection.findIndex(({ mint }) => highlightedNftMint === mint) ?? 0;
    const shift = !reverse ? 1 : -1;
    const nextHighlightedNft =
      selection.at(currenHighlightedNftIdx + shift) ?? selection.at(0);

    set(
      produce((state: SelectedNftsState) => {
        state.highlightedNftMint = nextHighlightedNft.mint;
      }),
    );
  },
  checkIsNftHighlighted: (mint: string) => {
    const { highlightedNftMint } = get();
    return highlightedNftMint === mint;
  },
  clearHighlightedNftMint: () =>
    set(
      produce((state: SelectedNftsState) => {
        state.highlightedNftMint = null;
      }),
    ),
}));

export const convertSuggestedNftToSelected = (
  nft: BorrowNftSuggested,
): BorrowNftSelected => {
  const solLoanValue = nft.isPriceBased
    ? nft?.priceBased.suggestedLoanValue
    : parseFloat(nft.timeBased.loanValue);

  return {
    ...nft,
    solLoanValue,
  };
};

export const convertBorrowNftToSelected = (
  nft: BorrowNft,
): BorrowNftSelected => {
  //? Set timeBased as default
  return {
    ...nft,
    isPriceBased: false,
    solLoanValue: parseFloat(nft.timeBased.loanValue),
  };
};
