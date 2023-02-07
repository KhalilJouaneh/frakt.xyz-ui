import { useCallback, useEffect, useMemo, useState } from 'react';

import { LoanType } from '@frakt/api/loans';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';

import {
  generateSelectOptions,
  getBorrowValueRange,
  getCheapestPairForBorrowValue,
  SelectValue,
} from './helpers';

export const useBorrowForm = () => {
  const {
    currentNft,
    currentLoanValue,
    setCurrentLoanValue,
    market,
    pairs,
    isBulk,
    totalBorrowValue,
    setCurrentLoanType,
    setCurrentPair,
    currentLoanType,
    currentPair,
  } = useBorrow();

  const [selectedOption, setSelectedOption] = useState<SelectValue | null>(
    null,
  );

  const onSelectOption = useCallback(
    (value: SelectValue) => {
      setSelectedOption(value);
      setCurrentLoanType(value.value.type);
    },
    [setCurrentLoanType],
  );

  const selectOptions = useMemo(() => {
    if (!currentNft) return [];
    return generateSelectOptions({
      nft: currentNft,
      bondsParams: {
        pairs,
      },
    });
  }, [currentNft, pairs]);

  useEffect(() => {
    if (selectOptions.length) {
      if (currentNft && currentLoanType) {
        const selectOption = selectOptions.find(({ value }) => {
          const sameLoanType = value?.type === currentLoanType;
          const isBond = currentLoanType === LoanType.BOND;

          if (!isBond) {
            return sameLoanType;
          }
          const sameBondDuration =
            value?.type === LoanType.BOND &&
            currentPair?.validation?.durationFilter / 86400 === value?.duration;

          return sameLoanType && sameBondDuration;
        });

        return onSelectOption(selectOption || selectOptions[0]);
      }

      onSelectOption(selectOptions[0]); //TODO: change to available. F.e. If classic loans not available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectOptions, onSelectOption]);

  useEffect(() => {
    if (selectedOption?.value?.type === LoanType.BOND && market) {
      const pair = getCheapestPairForBorrowValue({
        borrowValue: currentLoanValue,
        valuation: market?.oracleFloor?.floor,
        pairs,
        duration: selectedOption.value.duration,
      });

      setCurrentPair(pair);
    } else {
      setCurrentPair(null);
    }
  }, [market, currentLoanValue, pairs, selectedOption, setCurrentPair]);

  const [minBorrowValue, maxBorrowValue] = useMemo(() => {
    if (!currentNft || !selectedOption) return [0, 0];
    return getBorrowValueRange({
      nft: currentNft,
      loanType: selectedOption?.value?.type,
      bondsParams: {
        pairs,
        duration: selectedOption?.value?.duration,
        market,
      },
    });
  }, [currentNft, selectedOption, market, pairs]);

  useEffect(() => {
    if (selectedOption && maxBorrowValue && currentLoanType) {
      if (maxBorrowValue < currentLoanValue || currentLoanValue === 0) {
        setCurrentLoanValue(maxBorrowValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, maxBorrowValue]);

  return {
    currentLoanValue,
    minBorrowValue,
    maxBorrowValue,
    setCurrentLoanValue,
    selectOptions,
    selectedOption,
    onSelectOption,
    isBulk,
    totalBorrowValue,
  };
};
