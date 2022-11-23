import { sum } from 'ramda';

import { BorrowNftBulk } from '@frakt/api/nft';
import {
  feeOnDayForPriceBased,
  feeOnDayForTimeBased,
} from '../LoanFields/helpers';

const getPriceBasedValues = (
  nft: BorrowNftBulk,
): {
  priceBasedLoanValue: string;
  priceBasedFee: string;
  priceBasedLtvPersent: string;
  BorrowAPY: string;
  liquidationsPrice: string;
} => {
  const { valuation, priceBased, maxLoanValue } = nft;

  const valuationNumber = parseFloat(valuation);
  const suggestedLoanValue = priceBased?.suggestedLoanValue;

  const currentLtvPersent = (nft?.solLoanValue / valuationNumber) * 100;

  const currentLoanValue = (valuationNumber * currentLtvPersent) / 100;
  const loanValue = currentLoanValue || suggestedLoanValue;

  const isPriceBased = (nft?.priceBased as any)?.isBest;

  const suggestedFee = priceBased?.suggestedLoanValue * 0.01;
  const fee = (isPriceBased && suggestedFee) || Number(maxLoanValue) * 0.01;

  const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;
  const ltv = currentLtvPersent || parseFloat(suggestedLtvPersent.toFixed(0));

  const BorrowAPY = priceBased?.borrowAPRPercents;
  const collaterizationRateValue = priceBased?.collaterizationRate / 100;

  const liquidationsPrice = loanValue + loanValue * collaterizationRateValue;

  return {
    priceBasedLoanValue: loanValue?.toFixed(3),
    priceBasedFee: fee?.toFixed(3),
    priceBasedLtvPersent: ltv?.toFixed(0),
    BorrowAPY: BorrowAPY?.toFixed(0),
    liquidationsPrice: liquidationsPrice?.toFixed(3),
  };
};

const getTimeBasedValues = (nft: BorrowNftBulk) => {
  const { timeBased, valuation } = nft;
  const valuationNumber = parseFloat(valuation);

  const {
    fee,
    feeDiscountPercents,
    ltvPercents,
    repayValue,
    returnPeriodDays,
    loanValue: rawLoanValue,
  } = timeBased;

  const loanValue = nft?.solLoanValue || rawLoanValue;

  const feeDiscountValue = Number(feeDiscountPercents) * 0.01;

  const timeBasedfeeWithDiscount = Number(fee) - Number(fee) * feeDiscountValue;
  const ltv = nft?.solLoanValue
    ? (nft.solLoanValue / valuationNumber) * 100
    : ltvPercents;

  return {
    timeBasedFee: timeBasedfeeWithDiscount.toFixed(3),
    timeBasedLtvPersent: ltv?.toFixed(0),
    feeDiscountPercents,
    period: returnPeriodDays,
    repayValue,
    loanValue,
  };
};

export const getSelectedBulkValues = (nft: BorrowNftBulk) => {
  const { isPriceBased } = nft;

  const {
    timeBasedFee,
    period,
    repayValue,
    timeBasedLtvPersent,
    feeDiscountPercents,
    loanValue: rawMaxLoanValue,
  } = getTimeBasedValues(nft);

  const {
    priceBasedLoanValue,
    priceBasedLtvPersent,
    BorrowAPY,
    liquidationsPrice,
  } = getPriceBasedValues(nft);

  const loanValue = isPriceBased
    ? nft?.solLoanValue || priceBasedLoanValue
    : rawMaxLoanValue;

  const fee = isPriceBased
    ? (Number(loanValue) * 0.01).toFixed(3)
    : timeBasedFee;

  const loanToValue = isPriceBased ? priceBasedLtvPersent : timeBasedLtvPersent;

  return {
    maxLoanValue: Number(loanValue)?.toFixed(3),
    fee,
    loanToValue,
    BorrowAPY,
    liquidationsPrice,
    feeDiscountPercents,
    period,
    repayValue,
  };
};

export const getFeesOnDay = (selectedBulk: BorrowNftBulk[]): number => {
  return sum(
    selectedBulk.map((nft): number => {
      const { valuation, timeBased } = nft;
      const valuationNumber = parseFloat(valuation);

      const suggestedLoanValue = nft?.priceBased?.suggestedLoanValue;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;

      const rawLtv = (nft?.solLoanValue / valuationNumber) * 100;

      const timeBasedLtv = timeBased.ltvPercents;
      const priceBasedLtv = nft?.priceBased?.ltvPercents;

      const ltv =
        rawLtv || suggestedLtvPersent || priceBasedLtv || timeBasedLtv;

      if (nft.isPriceBased) {
        return feeOnDayForPriceBased(nft, ltv).feeOnDay;
      } else {
        return feeOnDayForTimeBased(nft, ltv).feeOnDay;
      }
    }),
  );
};

export const getFeesOnDayForMaxDuration = (selectedBulk: BorrowNftBulk[]) => {
  return sum(
    selectedBulk.map((nft): number => {
      const { valuation, timeBased } = nft;
      const valuationNumber = parseFloat(valuation);

      const maxDuraionDays = 14;
      const isMaxDurationNft = timeBased.returnPeriodDays === maxDuraionDays;
      const isPriceBased = nft?.isPriceBased;

      const suggestedLoanValue = nft?.priceBased?.suggestedLoanValue;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;
      const rawLtv = (nft?.solLoanValue / valuationNumber) * 100;
      const timeBasedLtv = timeBased.ltvPercents;

      const ltv = rawLtv || suggestedLtvPersent || timeBasedLtv;

      if (isMaxDurationNft) {
        if (isPriceBased) {
          return feeOnDayForPriceBased(nft, ltv).feeOnDay;
        }
        return feeOnDayForTimeBased(nft, ltv).feeOnDay;
      }
      if (isPriceBased) {
        return feeOnDayForPriceBased(nft, ltv).feeOnDay;
      }
      return 0;
    }),
  );
};

export const getTotalBorrowed = (selectedBulk: BorrowNftBulk[]): number => {
  const bulksValues = selectedBulk.map((nft) => {
    const { timeBased } = nft;
    const loanValueNumber = parseFloat(timeBased.loanValue);

    return (
      nft?.solLoanValue || nft.priceBased?.suggestedLoanValue || loanValueNumber
    );
  });

  return sum(bulksValues);
};
