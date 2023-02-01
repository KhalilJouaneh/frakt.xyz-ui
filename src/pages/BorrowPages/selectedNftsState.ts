import create from 'zustand';
import produce from 'immer';

import { BorrowNft, BorrowNftSuggested } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';
import { Market, Pair } from '@frakt/api/bonds';

export interface BorrowNftSelected extends BorrowNftSuggested {
  loanValue: number; //? lamports

  bondAccounts?: {
    market: Market;
    pair: Pair;
  };
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
    setHighlightedNftMint(bulkSelection[0]?.borrowNft?.mint);
  },
  addNftToSelection: (nft) => {
    set(
      produce((state: SelectedNftsState) => {
        state.selection.push(nft);
      }),
    );
    const { setHighlightedNftMint } = get();
    setHighlightedNftMint(nft.borrowNft.mint);
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
          ({ borrowNft }) => borrowNft.mint !== nftMint,
        );
      }),
    );
  },
  updateNftInSelection: (nft) => {
    set(
      produce((state: SelectedNftsState) => {
        const nftToReplaceIdx =
          state.selection.findIndex(
            ({ borrowNft }) => borrowNft.mint === nft.borrowNft.mint,
          ) ?? null;
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
    return (
      selection.find(({ borrowNft }) => borrowNft.mint === nftMint) ?? null
    );
  },
  toggleNftInSelection: (nft) => {
    const { findNftInSelection, addNftToSelection, removeNftFromSelection } =
      get();
    const isNftInSelection = !!findNftInSelection(nft.borrowNft.mint);
    isNftInSelection
      ? removeNftFromSelection(nft.borrowNft.mint)
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
      selection.findIndex(
        ({ borrowNft }) => highlightedNftMint === borrowNft.mint,
      ) ?? 0;
    const shift = !reverse ? 1 : -1;
    const nextHighlightedNft =
      selection.at(currenHighlightedNftIdx + shift) ?? selection.at(0);

    set(
      produce((state: SelectedNftsState) => {
        state.highlightedNftMint = nextHighlightedNft.borrowNft.mint;
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
  const loandValue =
    nft.loanType === LoanType.PRICE_BASED
      ? nft?.priceBasedSuggestion.loandValue
      : nft.borrowNft?.classicParams?.maxLoanValue;

  //TODO: Insert bond logic for bulks here

  return {
    ...nft,
    loanValue: loandValue,
  };
};

export const convertBorrowNftToSelected = (
  nft: BorrowNft,
): BorrowNftSelected => {
  //? Set timeBased as default
  //TODO set with other logic
  return {
    loanType: LoanType.TIME_BASED,
    borrowNft: nft,
    loanValue: nft?.classicParams?.maxLoanValue,
  };
};
