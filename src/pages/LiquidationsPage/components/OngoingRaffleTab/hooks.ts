import create from 'zustand';
import { RaffleListItem } from '@frakt/state/liquidations/types';

interface LiquidationRafflesState {
  setRaffles: (value: RaffleListItem[]) => void;
  raffles: RaffleListItem[];
}

export const useLiquidationRaffles = create<LiquidationRafflesState>((set) => ({
  raffles: [],
  setRaffles: (nextValue) => set((state) => ({ ...state, raffles: nextValue })),
}));
