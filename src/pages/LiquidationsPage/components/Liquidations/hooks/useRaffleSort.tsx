import create from 'zustand';

export interface SortData {
  sortBy: string;
  sort: string;
  search: any;
  collections: string;
}

interface RaffleSortState {
  setSortQuery: (value: SortData) => void;
  queryData: SortData;
}

export const useRaffleSort = create<RaffleSortState>((set) => ({
  queryData: null,
  setSortQuery: (nextValue) =>
    set((state) => ({ ...state, queryData: nextValue })),
}));
