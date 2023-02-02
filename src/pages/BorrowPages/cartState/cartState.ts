import create from 'zustand';
import produce from 'immer';

import { Market, Pair } from '@frakt/api/bonds';
import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { BondParams, Order } from './types';

interface CartState {
  pairs: Pair[];
  orders: Order[];
  addOrder: (props: {
    loanType: LoanType;
    loanValue: number;
    nft: BorrowNft;
    pair?: Pair;
    market?: Market;
  }) => void;
  updateOrder: (props: {
    loanType: LoanType;
    loanValue: number;
    nft: BorrowNft;
    pair?: Pair;
    market?: Market;
  }) => void;
  removeOrder: (props: { nftMint: string }) => void;
}

export const useCartState = create<CartState>((set, get) => ({
  pairs: [],
  orders: [],
  addOrder: ({ loanType, nft, loanValue, pair, market }) => {
    if (loanType !== LoanType.BOND) {
      return set(
        produce((state: CartState) => {
          state.orders.push(
            convertBorrowNftToOrder({
              nft,
              loanType,
              loanValue,
            }),
          );
        }),
      );
    }

    const bondsAmount = calcBondsAmount({
      loanValue,
      spotPrice: pair.currentSpotPrice,
    });

    set(
      produce((state: CartState) => {
        state.orders.push(
          convertBorrowNftToOrder({
            nft,
            loanType,
            loanValue,
            bondParams: {
              spotPrice: pair.currentSpotPrice,
              pairPubkey: pair.publicKey,
              market,
            },
          }),
        );

        const pairInState = state.pairs.find(
          ({ publicKey }) => publicKey === pair.publicKey,
        );

        if (!pairInState) {
          state.pairs.push({
            ...pair,
            edgeSettlement: pair.edgeSettlement - bondsAmount,
          });
        } else {
          pairInState.edgeSettlement -= bondsAmount;
        }
      }),
    );
  },
  removeOrder: ({ nftMint }) => {
    set(
      produce((state: CartState) => {
        const order = state.orders.find(
          ({ borrowNft }) => borrowNft.mint === nftMint,
        );

        if (order.loanType === LoanType.BOND) {
          const bondsAmount = calcBondsAmount({
            loanValue: order.loanValue,
            spotPrice: order.bondParams.spotPrice,
          });

          const pairInState = state.pairs.find(
            ({ publicKey }) => publicKey === order.bondParams.pairPubkey,
          );

          pairInState.edgeSettlement += bondsAmount;
        }

        state.orders = state.orders.filter(
          ({ borrowNft }) => borrowNft.mint !== nftMint,
        );
      }),
    );
  },
  updateOrder: ({ loanType, nft, loanValue, pair, market }) => {
    const { addOrder, removeOrder } = get();

    removeOrder({
      nftMint: nft.mint,
    });

    addOrder({
      loanType,
      nft,
      loanValue,
      pair,
      market,
    });
  },
}));

type ConvertBorrowNftToOrder = (props: {
  nft: BorrowNft;
  loanType: LoanType;
  loanValue: number;
  bondParams?: BondParams;
}) => Order;
const convertBorrowNftToOrder: ConvertBorrowNftToOrder = ({
  nft,
  loanType,
  loanValue,
  bondParams,
}) => {
  return {
    loanType,
    borrowNft: nft,
    loanValue,
    bondParams,
  };
};

type CalcBondsAmount = (props: {
  loanValue: number;
  spotPrice: number;
}) => number;
const calcBondsAmount: CalcBondsAmount = ({ loanValue, spotPrice }) =>
  Math.trunc(loanValue / spotPrice);
