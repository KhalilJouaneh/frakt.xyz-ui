import { useEffect, useMemo } from 'react';

import { Market, Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/nft';

import { BorrowNftSelected } from '../../../selectedNftsState';
import {
  generateSelectOptions,
  getBorrowValueRange,
  getCheapestPairForBorrowValue,
  getPairWithMaxBorrowValue,
  SelectValue,
} from './helpers';

type UseBorrowForm = (props: {
  nft: BorrowNftSelected;
  market?: Market;
  pairs?: Pair[];
  updateNftInSelection: (nft: BorrowNftSelected) => void;
}) => {
  selectedBorrowValue: number;
  onSliderUpdate: (borrowValue: number) => void;
  borrowRange: [number, number];
  selectOptions: SelectValue[];
  selectedOption: SelectValue;
  onOptionChange: (option: SelectValue) => void;
};

export const useBorrowForm: UseBorrowForm = ({
  nft,
  market,
  pairs,
  updateNftInSelection,
}) => {
  const selectOptions = useMemo(
    () =>
      generateSelectOptions({
        nft,
        bondsParams: {
          market,
          pairs,
        },
      }),
    [nft, market, pairs],
  );

  const selectedOption = useMemo(
    () =>
      selectOptions.find((option) => {
        const { type, duration } = option.value;

        if (type === LoanType.BOND) {
          return (
            nft.bondParams?.pair?.validation?.durationFilter /
              (24 * 60 * 60) ===
            duration
          );
        }

        return nft.loanType === type;
      }),
    [selectOptions, nft],
  );

  const [minBorrowValue, maxBorrowValue] = useMemo(() => {
    return getBorrowValueRange({
      nft,
      bondsParams: {
        pairs,
        duration: selectedOption.value.duration,
        market,
      },
    });
  }, [nft, pairs, market, selectedOption]);

  const onOptionChange = (option: SelectValue) => {
    const { type, duration } = option.value;

    updateNftInSelection({
      ...nft,
      loanType: type,
      solLoanValue: maxBorrowValue,
      bondParams:
        type === LoanType.BOND
          ? {
              market,
              pair: getPairWithMaxBorrowValue({
                pairs,
                collectionFloor: parseFloat(nft.valuation),
                duration: duration,
              }),
            }
          : null,
    });
  };

  //? Set maximum BorrowValue as default when change option
  useEffect(() => {
    return updateNftInSelection({
      ...nft,
      solLoanValue: maxBorrowValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxBorrowValue, updateNftInSelection]);

  const onSliderUpdate = (borrowValue: number) => {
    const { type, duration } = selectedOption.value;

    if (type === LoanType.BOND) {
      const cheapestPair = getCheapestPairForBorrowValue({
        borrowValue,
        valuation: parseFloat(nft.valuation),
        pairs,
        duration: duration,
      });

      return updateNftInSelection({
        ...nft,
        solLoanValue: borrowValue,
        bondParams: {
          market,
          pair: cheapestPair,
        },
      });
    }

    updateNftInSelection({
      ...nft,
      solLoanValue: borrowValue,
    });
  };

  return {
    selectedBorrowValue: nft.solLoanValue,
    onSliderUpdate,
    borrowRange: [minBorrowValue, maxBorrowValue],
    selectOptions,
    selectedOption,
    onOptionChange,
  };
};
