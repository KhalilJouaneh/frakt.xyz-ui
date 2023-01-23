import { LoanType } from '@frakt/api/loans';

import { BorrowNftSelected } from '../selectedNftsState';
import { CARD_VALUES_TYPES } from './types';

const getParsedTimeBasedLoanValues = (nft: BorrowNftSelected) => {
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

  const loanValue = nft?.solLoanValue || parseFloat(rawLoanValue);

  const feeDiscountValue = parseFloat(feeDiscountPercents) * 0.01;

  const timeBasedFeeWithDiscount =
    parseFloat(fee) - parseFloat(fee) * feeDiscountValue;
  const ltv = nft?.solLoanValue
    ? (nft.solLoanValue / valuationNumber) * 100
    : ltvPercents;

  return {
    timeBasedFee: timeBasedFeeWithDiscount,
    timeBasedLtvPersent: ltv,
    feeDiscountPercent: parseFloat(feeDiscountPercents),
    returnPeriodDays,
    repayValue: parseFloat(repayValue),
    loanValue,
  };
};

const getParsedPriceBasedLoanValues = (nft: BorrowNftSelected) => {
  const { valuation: valuationString, priceBased, maxLoanValue } = nft;

  const valuation = parseFloat(valuationString);

  const currentLtvPercent = (nft?.solLoanValue / valuation) * 100;

  const currentLoanValue = (valuation * currentLtvPercent) / 100;
  const loanValue = currentLoanValue;

  const fee = parseFloat(maxLoanValue) * 0.01;

  const ltv = currentLtvPercent;

  const borrowAPY = priceBased?.borrowAPRPercents;
  const collaterizationRateValue = priceBased?.collaterizationRate / 100;

  const liquidationPrice = loanValue + loanValue * collaterizationRateValue;

  return {
    priceBasedLoanValue: loanValue,
    priceBasedFee: fee,
    priceBasedLtvPersent: ltv,
    borrowAPY: borrowAPY,
    liquidationPrice,
  };
};

export const getLoanFields = (
  nft: BorrowNftSelected,
): Array<{
  title: string;
  value: string;
  valueType: CARD_VALUES_TYPES;
}> => {
  const { loanType } = nft;

  const isPriceBased = loanType === LoanType.PRICE_BASED;

  const {
    timeBasedFee,
    returnPeriodDays,
    repayValue,
    timeBasedLtvPersent,
    feeDiscountPercent,
    loanValue,
  } = getParsedTimeBasedLoanValues(nft);

  const {
    priceBasedLoanValue,
    priceBasedLtvPersent,
    borrowAPY,
    liquidationPrice,
  } = getParsedPriceBasedLoanValues(nft);

  const maxLoanValue = isPriceBased
    ? nft?.solLoanValue || priceBasedLoanValue
    : loanValue;

  const fee = isPriceBased ? maxLoanValue * 0.01 : timeBasedFee;

  const loanToValue = isPriceBased ? priceBasedLtvPersent : timeBasedLtvPersent;

  return [
    {
      title: 'Loan to value',
      value: loanToValue.toFixed(1),
      valueType: CARD_VALUES_TYPES.percent,
    },
    {
      title: 'Floor price',
      value: parseFloat(nft.valuation).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    },
    {
      title: isPriceBased ? 'Upfront fee' : 'fee',
      value: fee.toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    },
    {
      title: 'To borrow',
      value: maxLoanValue.toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    },
    {
      title: 'Duration',
      value: `${isPriceBased ? `Perpetual` : `${returnPeriodDays} days`}`,
      valueType: CARD_VALUES_TYPES.string,
    },
    isPriceBased
      ? {
          title: 'Liquidations price',
          value: liquidationPrice.toFixed(3),
          valueType: CARD_VALUES_TYPES.solPrice,
        }
      : null,
    isPriceBased
      ? {
          title: 'Borrow APY',
          value: borrowAPY.toFixed(1),
          valueType: CARD_VALUES_TYPES.percent,
        }
      : null,
    !isPriceBased
      ? {
          title: 'Holder discount',
          value: feeDiscountPercent.toFixed(3),
          valueType: CARD_VALUES_TYPES.percent,
        }
      : null,
    !isPriceBased
      ? {
          title: 'To repay',
          value: repayValue.toFixed(3),
          valueType: CARD_VALUES_TYPES.string,
        }
      : null,
  ].filter(Boolean);
};
