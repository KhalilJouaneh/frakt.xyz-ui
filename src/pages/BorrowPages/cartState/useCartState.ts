import create from 'zustand';
import produce from 'immer';

import { Market, Pair } from '@frakt/api/bonds';
import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { BondOrderParams, Order } from './types';

interface CartState {
  pairs: Pair[];
  orders: Order[];
  addOrder: (props: {
    loanType: LoanType;
    loanValue: number;
    nft: BorrowNft;
    pair?: Pair;
    market?: Market;
    unshift?: boolean;
  }) => void;
  updateOrder: (props: {
    loanType: LoanType;
    loanValue: number;
    nft: BorrowNft;
    pair?: Pair;
    market?: Market;
  }) => void;
  removeOrder: (props: { nftMint: string }) => void;
  findPair: (props: { pairPubkey: string }) => Pair | null;
  findOrder: (props: { nftMint: string }) => Order | null;
  clearCart: () => void;
}

export const useCartState = create<CartState>((set, get) => ({
  pairs: [],
  orders: [],
  addOrder: ({ loanType, nft, loanValue, pair, market, unshift = false }) => {
    if (loanType !== LoanType.BOND) {
      return set(
        produce((state: CartState) => {
          const order = convertBorrowNftToOrder({
            nft,
            loanType,
            loanValue,
          });

          unshift ? state.orders.unshift(order) : state.orders.push(order);
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
            bondOrderParams: {
              market,
              orderParams: [
                {
                  orderSize: 0, //TODO;
                  spotPrice: pair.currentSpotPrice,
                  pairPubkey: pair.publicKey,
                },
              ],
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
            spotPrice: order.bondOrderParams[0]?.spotPrice,
          });

          const pairInState = state.pairs.find(
            ({ publicKey }) =>
              publicKey === order.bondOrderParams[0]?.pairPubkey,
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
  findPair: ({ pairPubkey }) => {
    const { pairs } = get();
    return pairs.find(({ publicKey }) => publicKey === pairPubkey) ?? null;
  },
  findOrder: ({ nftMint }) => {
    const { orders } = get();
    return orders.find(({ borrowNft }) => borrowNft.mint === nftMint) ?? null;
  },
  clearCart: () =>
    set(
      produce((state: CartState) => {
        state.orders = [];
        state.pairs = [];
      }),
    ),
}));

type ConvertBorrowNftToOrder = (props: {
  nft: BorrowNft;
  loanType: LoanType;
  loanValue: number;
  bondOrderParams?: BondOrderParams;
}) => Order;
const convertBorrowNftToOrder: ConvertBorrowNftToOrder = ({
  nft,
  loanType,
  loanValue,
  bondOrderParams,
}) => {
  return {
    loanType,
    borrowNft: nft,
    loanValue,
    bondOrderParams,
  };
};

type CalcBondsAmount = (props: {
  loanValue: number;
  spotPrice: number;
}) => number;
export const calcBondsAmount: CalcBondsAmount = ({ loanValue, spotPrice }) => {
  loanValue;
  spotPrice;
  // return 0;
  return Math.trunc(loanValue / spotPrice);
};
