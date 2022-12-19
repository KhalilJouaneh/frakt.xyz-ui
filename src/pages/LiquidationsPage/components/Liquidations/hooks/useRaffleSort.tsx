import create from 'zustand';
import { FetchItemsParams } from '@frakt/api/raffle';

interface RaffleSortState {
  setSortQuery: (value: FetchItemsParams) => void;
  queryData: FetchItemsParams;
}

export const useRaffleSort = create<RaffleSortState>((set) => ({
  queryData: null,
  setSortQuery: (nextValue) =>
    set((state) => ({ ...state, queryData: nextValue })),
}));
