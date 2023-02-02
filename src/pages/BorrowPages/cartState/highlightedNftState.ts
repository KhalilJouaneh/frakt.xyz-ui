import create from 'zustand';
import produce from 'immer';

interface HighlightedNftState {
  highlightedNftMint: string | null;
  setHighlightedNftMint: (mint: string) => void;
  checkIsNftHighlighted: (mint: string) => boolean;
  clearHighlightedNftMint: () => void;
}

export const useHighlightedNft = create<HighlightedNftState>((set, get) => ({
  highlightedNftMint: null,
  setHighlightedNftMint: (mint: string) =>
    set(
      produce((state: HighlightedNftState) => {
        state.highlightedNftMint = mint;
      }),
    ),
  checkIsNftHighlighted: (mint: string) => {
    const { highlightedNftMint } = get();
    return highlightedNftMint === mint;
  },
  clearHighlightedNftMint: () =>
    set(
      produce((state: HighlightedNftState) => {
        state.highlightedNftMint = null;
      }),
    ),
}));
