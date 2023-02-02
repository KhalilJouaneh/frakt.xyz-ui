import { LoanType } from '@frakt/api/loans';

import { Order } from '../cartState';
import { CARD_VALUES_TYPES } from './types';

const getParsedTimeBasedLoanValues = (order: Order) => {
  const { classicParams, valuation } = order.borrowNft;

  const {
    fee,
    feeDiscountPercent,
    ltvPercent,
    repayValue,
    returnPeriodDays,
    loanValue: timeBasedLoanValue,
  } = classicParams.timeBased;

  const loanValue = order?.loanValue || timeBasedLoanValue;

  const feeDiscountValue = feeDiscountPercent * 0.01;

  const timeBasedFeeWithDiscount = fee - fee * feeDiscountValue;
  const ltv = order?.loanValue
    ? (order.loanValue / valuation) * 100
    : ltvPercent;

  return {
    timeBasedFee: timeBasedFeeWithDiscount,
    timeBasedLtvPersent: ltv,
    feeDiscountPercent,
    returnPeriodDays,
    repayValue,
    loanValue,
  };
};

const getParsedPriceBasedLoanValues = (order: Order) => {
  const { valuation, classicParams } = order.borrowNft;

  const currentLtvPercent = (order?.loanValue / valuation) * 100;

  const currentLoanValue = (valuation * currentLtvPercent) / 100;
  const loanValue = currentLoanValue;

  const fee = classicParams.maxLoanValue * 0.01;

  const ltv = currentLtvPercent;

  const borrowAPY = classicParams.priceBased?.borrowAPRPercent;
  const collaterizationRateValue =
    classicParams.priceBased?.collaterizationRate / 100;

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
  order: Order,
): Array<{
  title: string;
  value: string;
  valueType: CARD_VALUES_TYPES;
}> => {
  const { loanType } = order;

  const isPriceBased = loanType === LoanType.PRICE_BASED;

  const {
    timeBasedFee,
    returnPeriodDays,
    repayValue,
    timeBasedLtvPersent,
    feeDiscountPercent,
    loanValue,
  } = getParsedTimeBasedLoanValues(order);

  const {
    priceBasedLoanValue,
    priceBasedLtvPersent,
    borrowAPY,
    liquidationPrice,
  } = getParsedPriceBasedLoanValues(order);

  const maxLoanValue = isPriceBased
    ? order?.loanValue || priceBasedLoanValue
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
      value: order.borrowNft.valuation.toFixed(3),
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
