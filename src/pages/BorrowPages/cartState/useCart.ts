import { useMemo } from 'react';
import { sum } from 'lodash';

import { useMarket, useMarketPairs } from '@frakt/utils/bonds';
import { BorrowNft } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';
import { Market, Pair } from '@frakt/api/bonds';

import { useCartState } from './cartState';
import { useHighlightedNft } from './highlightedNftState';
import { Order } from './types';

export const useCart = () => {
  const {
    orders,
    pairs: cartPairs,
    addOrder,
    removeOrder,
    updateOrder,
  } = useCartState();

  const {
    highlightedNftMint,
    checkIsNftHighlighted,
    clearHighlightedNftMint,
    setHighlightedNftMint,
  } = useHighlightedNft();

  const findOrder = (nftMint: string) =>
    orders.find(({ borrowNft }) => borrowNft.mint === nftMint);

  const currentOrder = findOrder(highlightedNftMint);

  const { pairs: rawPairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey: currentOrder?.borrowNft?.bondParams?.marketPubkey,
  });

  const { market, isLoading: isLoadingMarket } = useMarket({
    marketPubkey: currentOrder?.borrowNft?.bondParams?.marketPubkey,
  });

  const pairs = useMemo(
    () =>
      isLoadingPairs
        ? []
        : rawPairs.map((rawPair) => {
            const samePairSelected = cartPairs.find(
              (cartPair) => cartPair.publicKey === rawPair.publicKey,
            );
            return samePairSelected ?? rawPair;
          }),
    [cartPairs, rawPairs, isLoadingPairs],
  );

  const onSelectNft = (nft: BorrowNft) => {
    setHighlightedNftMint(nft.mint);

    //? First selection. Select timeBased by default
    //TODO select available loanType (timeBased may not exist)
    addOrder({
      loanType: LoanType.TIME_BASED,
      nft,
      loanValue: nft?.classicParams?.maxLoanValue,
    });
  };

  const onRemoveOrder = (order: Order) => {
    if (checkIsNftHighlighted(order?.borrowNft?.mint)) {
      onNextOrderSelect();
    }
    if (orders.length === 1) clearHighlightedNftMint();

    removeOrder({ nftMint: order.borrowNft.mint });
  };

  const onUpdateOrder = (props: {
    loanType: LoanType;
    loanValue: number;
    nft: BorrowNft;
    pair?: Pair;
    market?: Market;
  }) => {
    const { loanType, loanValue, nft, pair } = props;

    updateOrder({
      loanType,
      nft,
      loanValue,
      pair,
      market,
    });
  };

  const totalBorrowValue = useMemo(() => {
    return sum(orders.map(({ loanValue }) => loanValue));
  }, [orders]);

  const onNextOrderSelect = (reverse?: boolean) => {
    if (orders.length === 0) return;
    const currentIdx =
      orders.findIndex(
        ({ borrowNft }) => highlightedNftMint === borrowNft.mint,
      ) ?? 0;

    const shift = !reverse ? 1 : -1;

    setHighlightedNftMint(
      (orders.at(currentIdx + shift) ?? orders.at(0))?.borrowNft?.mint,
    );
  };

  return {
    market,
    orders,
    findOrder,
    highlightedNftMint,
    onNextOrderSelect,
    pairs,
    isLoading: isLoadingMarket || isLoadingPairs,
    onSelectNft,
    onUpdateOrder,
    onRemoveOrder,
    currentOrder,
    totalBorrowValue,
  };
};
