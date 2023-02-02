import { useMemo } from 'react';

import { LoanType } from '@frakt/api/loans';

import { generateSelectOptions, SelectValue } from './helpers';
import {
  useCart,
  getBorrowValueRange,
  getCheapestPairForBorrowValue,
  getPairWithMaxBorrowValue,
} from '@frakt/pages/BorrowPages/cartState';

export const useBorrowForm = () => {
  const {
    currentOrder,
    onUpdateOrder,
    totalBorrowValue,
    orders,
    market,
    pairs,
  } = useCart();

  const selectOptions = useMemo(
    () =>
      generateSelectOptions({
        nft: currentOrder,
        bondsParams: {
          market,
          pairs,
        },
      }),
    [currentOrder, market, pairs],
  );

  const selectedOption = useMemo(
    () =>
      selectOptions.find((option) => {
        const { type, duration } = option.value;

        if (type === LoanType.BOND) {
          const pair = pairs.find(
            ({ publicKey }) =>
              publicKey === currentOrder.bondParams?.pairPubkey,
          );
          return pair?.validation?.durationFilter / (24 * 60 * 60) === duration;
        }

        return currentOrder.loanType === type;
      }),
    [selectOptions, currentOrder, pairs],
  );

  const [minBorrowValue, maxBorrowValue] = useMemo(() => {
    return getBorrowValueRange({
      order: currentOrder,
      bondsParams: {
        pairs,
        duration: selectedOption.value.duration,
        market,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder.borrowNft.mint, selectedOption.label]);

  const onOptionChange = (option: SelectValue) => {
    const { type, duration } = option.value;

    const pair = getPairWithMaxBorrowValue({
      pairs,
      collectionFloor: market?.oracleFloor?.floor,
      duration,
    });

    onUpdateOrder({
      loanType: type,
      nft: currentOrder.borrowNft,
      loanValue: maxBorrowValue,
      pair,
      market,
    });
  };

  // //? Set maximum BorrowValue as default when change option
  //TODO:
  // useEffect(() => {
  //   console.log(selectedOption.label);

  //   onUpdateOrder({
  //     loanType: currentOrder.loanType,
  //     loanValue: maxBorrowValue,
  //     nft: currentOrder.borrowNft,
  //     pair:
  //       currentOrder.loanType === LoanType.BOND
  //         ? pairs.find(
  //             ({ publicKey }) =>
  //               publicKey === currentOrder.bondParams.pairPubkey,
  //           )
  //         : null,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedOption.label]);

  const onSliderUpdate = (borrowValue: number) => {
    const { type, duration } = selectedOption.value;

    if (type === LoanType.BOND) {
      const cheapestPair = getCheapestPairForBorrowValue({
        borrowValue,
        valuation: market?.oracleFloor?.floor,
        pairs,
        duration: duration,
      });

      return onUpdateOrder({
        loanType: currentOrder.loanType,
        nft: currentOrder.borrowNft,
        loanValue: borrowValue,
        pair: cheapestPair,
        market,
      });
    }

    onUpdateOrder({
      loanType: currentOrder.loanType,
      nft: currentOrder.borrowNft,
      loanValue: borrowValue,
      market,
    });
  };

  return {
    selectedBorrowValue: currentOrder.loanValue,
    onSliderUpdate,
    borrowRange: [minBorrowValue, maxBorrowValue],
    selectOptions,
    selectedOption,
    onOptionChange,
    totalBorrowValue,
    isBulk: orders.length > 1,
  };
};
