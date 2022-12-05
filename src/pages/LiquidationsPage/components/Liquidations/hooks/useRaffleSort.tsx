import { FetchItemsParams } from '@frakt/api/raffle';
import create from 'zustand';

interface RaffleSortState {
  setSortQuery: (value: FetchItemsParams) => void;
  queryData: FetchItemsParams;
}

export const useRaffleSort = create<RaffleSortState>((set) => ({
  queryData: null,
  setSortQuery: (nextValue) =>
    set((state) => ({ ...state, queryData: nextValue })),
}));
