import { sum, map } from 'ramda';

import { BulkValues } from '../../hooks';

const getPriceBasedValues = (
  nft: BulkValues,
): {
  priceBasedLoanValue: string;
  priceBasedFee: string;
  priceBasedLtvPersent: string;
  BorrowAPY: string;
  liquidationsPrice: string;
} => {
  const { valuation, priceBased, maxLoanValue } = nft;

  const valuationNumber = parseFloat(valuation);
  const currentLtvPersent = priceBased?.ltv;
  const suggestedLoanValue = priceBased?.suggestedLoanValue;

  const currentLoanValue = (valuationNumber * currentLtvPersent) / 100;
  const loanValue = currentLoanValue || suggestedLoanValue;

  const isPriceBased = (nft?.priceBased as any).isBest;

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

const getTimeBasedValues = (nft: BulkValues) => {
  const { timeBased } = nft;

  const {
    fee,
    feeDiscountPercents,
    ltvPercents,
    repayValue,
    returnPeriodDays,
  } = timeBased;

  const feeDiscountValue = Number(feeDiscountPercents) * 0.01;

  const timeBasedfeeWithDiscount = Number(fee) - Number(fee) * feeDiscountValue;

  return {
    timeBasedFee: timeBasedfeeWithDiscount.toFixed(3),
    timeBasedLtvPersent: ltvPercents.toFixed(0),
    feeDiscountPercents,
    period: returnPeriodDays,
    repayValue,
  };
};

export const getSelectedBulkValues = (nft: BulkValues) => {
  const { maxLoanValue: rawMaxLoanValue, isPriceBased } = nft;

  const {
    timeBasedFee,
    period,
    repayValue,
    timeBasedLtvPersent,
    feeDiscountPercents,
  } = getTimeBasedValues(nft);

  const {
    priceBasedLoanValue,
    priceBasedFee,
    priceBasedLtvPersent,
    BorrowAPY,
    liquidationsPrice,
  } = getPriceBasedValues(nft);

  const loanType = isPriceBased ? 'Perpetual' : 'Flip';

  const maxLoanValue = isPriceBased ? priceBasedLoanValue : rawMaxLoanValue;

  const fee = isPriceBased ? priceBasedFee : timeBasedFee;

  const loanToValue = isPriceBased ? priceBasedLtvPersent : timeBasedLtvPersent;

  return {
    loanType,
    maxLoanValue,
    fee,
    loanToValue,
    BorrowAPY,
    liquidationsPrice,
    feeDiscountPercents,
    period,
    repayValue,
  };
};

export const getFeesOnDay = (selectedBulk: BulkValues[]): number => {
  return sum(
    selectedBulk.map((nft): number => {
      if (!nft.isPriceBased) {
        const { timeBased } = nft;

        const { feeDiscountPercents, fee, returnPeriodDays } = timeBased;

        const feeDiscountPercentsValue = Number(feeDiscountPercents) * 0.01;
        const dayFee = Number(fee) / returnPeriodDays;

        return dayFee - dayFee * feeDiscountPercentsValue;
      } else {
        const { priceBased, valuation } = nft;

        const ltv = priceBased?.ltv || priceBased?.ltvPercents;

        const loanValue = parseFloat(valuation) * (ltv / 100);

        return (loanValue * (priceBased.borrowAPRPercents * 0.01)) / 365;
      }
    }),
  );
};

export const getTotalBorrowed = (
  perpetualLoans: BulkValues[],
  flipLoans: BulkValues[],
): number => {
  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const perpetualLoansValues = perpetualLoans.map(
    ({ priceBased, valuation }) => {
      const valuationNumber = parseFloat(valuation);
      const ltv = priceBased?.ltv;

      if (ltv) {
        return valuationNumber * (ltv / 100);
      } else {
        return priceBased?.suggestedLoanValue;
      }
    },
  );

  const priceBasedLoansValue = sum(perpetualLoansValues);
  const timeBasedLoansValue = sum(map(maxLoanValue, flipLoans));

  return priceBasedLoansValue + timeBasedLoansValue || 0;
};
