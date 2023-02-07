import { useMemo } from 'react';
import { sum, map } from 'lodash';

import { BorrowNft } from '@frakt/api/nft';
import { useMarket, useMarketPairs } from '@frakt/utils/bonds';

import { useCurrentNft } from './useCurrentNft';
import { calcBondsAmount, useCartState } from './useCartState';

export const useBorrow = () => {
  const {
    orders: cartOrders,
    pairs: cartPairs,
    addOrder,
    removeOrder,
    findOrder: findOrderInCart,
    findPair: findPairInCart,
    clearCart,
  } = useCartState();

  const {
    nft: currentNft,
    setNft: setCurrentNft,
    pair: currentPair,
    setPair: setCurrentPair,
    loanType: currentLoanType,
    setLoanType: setCurrentLoanType,
    loanValue: currentLoanValue,
    setLoanValue: setCurrentLoanValue,
    clearState: clearCurrentNftState,
    setState: setCurrentNftState,
  } = useCurrentNft();

  const { pairs, market, isLoading } = useMarketAndPairs(
    currentNft?.bondParams?.marketPubkey,
  );

  const saveUpcomingOrderToCart = (unshift = false) => {
    if (currentNft && currentLoanType && currentLoanValue) {
      addOrder({
        loanType: currentLoanType,
        nft: currentNft,
        loanValue: currentLoanValue,
        pair: currentPair ?? null,
        market: market ?? null,
        unshift,
      });
      clearCurrentNftState();
    }
  };

  const onSelectNft = (nft: BorrowNft) => {
    saveUpcomingOrderToCart();

    setCurrentNft(nft);
  };

  const onRemoveNft = (nft: BorrowNft) => {
    const isNftInCart = !!findOrderInCart({ nftMint: nft.mint });

    if (isNftInCart) {
      return removeOrder({ nftMint: nft.mint });
    }

    const isCurrentNft = currentNft?.mint === nft.mint;
    if (isCurrentNft) {
      clearCurrentNftState();

      //TODO: Try to remove this logic duplication
      if (cartOrders.length > 0) {
        const cartOrder = cartOrders.at(0);

        const cartPair = findPairInCart({
          pairPubkey: cartOrder?.bondParams?.pairPubkey,
        });

        removeOrder({ nftMint: cartOrder?.borrowNft?.mint });

        setCurrentNftState({
          nft: cartOrder.borrowNft,
          loanType: cartOrder.loanType,
          loanValue: cartOrder.loanValue,
          pair: cartPair
            ? {
                ...cartPair,
                edgeSettlement:
                  cartPair.edgeSettlement +
                  calcBondsAmount({
                    loanValue: cartOrder.loanValue,
                    spotPrice: cartOrder?.bondParams?.spotPrice,
                  }),
              }
            : null,
        });
      }
    }
  };

  const onNextNftSelect = (reverse?: boolean) => {
    saveUpcomingOrderToCart(reverse);

    const cartOrder = reverse ? cartOrders.at(-1) : cartOrders.at(0);

    const cartPair = findPairInCart({
      pairPubkey: cartOrder?.bondParams?.pairPubkey,
    });

    removeOrder({ nftMint: cartOrder?.borrowNft?.mint });

    setCurrentNftState({
      nft: cartOrder.borrowNft,
      loanType: cartOrder.loanType,
      loanValue: cartOrder.loanValue,
      pair: cartPair
        ? {
            ...cartPair,
            edgeSettlement:
              cartPair.edgeSettlement +
              calcBondsAmount({
                loanValue: cartOrder.loanValue,
                spotPrice: cartOrder?.bondParams?.spotPrice,
              }),
          }
        : null,
    });
  };

  const setCurrentNftFromOrder = (mint: string) => {
    const cartOrder = cartOrders.find(
      ({ borrowNft }) => borrowNft.mint === mint,
    );
    const cartPair = findPairInCart({
      pairPubkey: cartOrder?.bondParams?.pairPubkey,
    });

    removeOrder({ nftMint: cartOrder?.borrowNft?.mint });

    setCurrentNftState({
      nft: cartOrder.borrowNft,
      loanType: cartOrder.loanType,
      loanValue: cartOrder.loanValue,
      pair: cartPair
        ? {
            ...cartPair,
            edgeSettlement:
              cartPair.edgeSettlement +
              calcBondsAmount({
                loanValue: cartOrder.loanValue,
                spotPrice: cartOrder?.bondParams?.spotPrice,
              }),
          }
        : null,
    });
  };

  const isBulk = cartOrders.length + Number(!!currentNft) > 1;

  const totalBorrowValue = useMemo(() => {
    return (
      sum(map(cartOrders, ({ loanValue }) => loanValue)) + currentLoanValue
    );
  }, [cartOrders, currentLoanValue]);

  return {
    cartOrders,
    cartPairs,
    pairs,
    currentNft,
    onNextNftSelect,
    isLoading,
    onSelectNft,
    isBulk,
    totalBorrowValue,
    onRemoveNft,
    market,
    currentLoanValue,
    setCurrentLoanValue,
    setCurrentLoanType,
    setCurrentPair,
    findOrderInCart,
    currentLoanType,
    currentPair,
    saveUpcomingOrderToCart,
    setCurrentNftFromOrder,
    clearCart,
  };
};

const useMarketAndPairs = (marketPubkey: string | null) => {
  const { pairs: cartPairs } = useCartState();

  const { pairs: rawPairs, isLoading: isLoadingPairs } = useMarketPairs({
    marketPubkey: marketPubkey,
  });

  const { market, isLoading: isLoadingMarket } = useMarket({
    marketPubkey: marketPubkey,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartPairs, isLoadingPairs],
  );

  return {
    isLoading: isLoadingMarket || isLoadingPairs,
    pairs,
    market,
  };
};
