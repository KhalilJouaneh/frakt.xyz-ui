import { Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';
import {
  calcBondFee,
  calcLtv,
  calcPriceBasedUpfrontFee,
  calcTimeBasedFee,
  calcTimeBasedRepayValue,
} from '@frakt/pages/BorrowPages/helpers';

import { Order } from '../cartState';
import { CARD_VALUES_TYPES, LoanCardValue, LOAN_TYPE_NAME } from './types';

type GetLoanFields = (props: {
  order: Order;
  pair?: Pair;
}) => Array<LoanCardValue>;
export const getLoanFields: GetLoanFields = ({ order, pair }) => {
  const { loanType, loanValue, borrowNft } = order;

  const fields: Array<LoanCardValue> = [];

  fields.push({
    title: 'Loan type',
    value: LOAN_TYPE_NAME[loanType],
    valueType: CARD_VALUES_TYPES.string,
  });

  const ltv = calcLtv({
    loanValue,
    nft: borrowNft,
  });

  fields.push({
    title: 'Loan to value',
    value: ltv.toFixed(0),
    valueType: CARD_VALUES_TYPES.percent,
  });

  fields.push({
    title: 'Floor price',
    value: (borrowNft?.valuation / 1e9).toFixed(3),
    valueType: CARD_VALUES_TYPES.solPrice,
  });

  //? TimeBased Fees
  if (loanType === LoanType.TIME_BASED) {
    const fee = calcTimeBasedFee({
      nft: order?.borrowNft,
      loanValue,
    });

    fields.push({
      title: 'Fee',
      value: (fee / 1e9).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }
  //? Bond Fees here
  if (loanType === LoanType.BOND) {
    const fee = calcBondFee({
      loanValue,
      pair,
    });

    fields.push({
      title: 'Fee',
      value: (fee / 1e9).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }

  //? PriceBased upfront fee
  if (loanType === LoanType.PRICE_BASED) {
    const upfrontFee = calcPriceBasedUpfrontFee({
      loanValue,
    });

    fields.push({
      title: 'Upfront fee',
      value: (upfrontFee / 1e9).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }

  fields.push({
    title: 'To borrow',
    value: (loanValue / 1e9).toFixed(3),
    valueType: CARD_VALUES_TYPES.solPrice,
  });

  //? TimeBased duration
  if (loanType === LoanType.TIME_BASED) {
    const { returnPeriodDays } = order.borrowNft.classicParams.timeBased;

    fields.push({
      title: 'Duration',
      value: `${returnPeriodDays} days`,
      valueType: CARD_VALUES_TYPES.string,
    });
  }

  //? PriceBased duration
  if (loanType === LoanType.PRICE_BASED) {
    fields.push({
      title: 'Duration',
      value: 'Perpetual',
      valueType: CARD_VALUES_TYPES.string,
    });
  }

  //TODO Bond duration here
  if (loanType === LoanType.BOND) {
    const { validation } = pair;

    fields.push({
      title: 'Duration',
      value: `${validation?.durationFilter / 86400} days`,
      valueType: CARD_VALUES_TYPES.string,
    });
  }

  //? PriceBased liquidation price
  if (loanType === LoanType.PRICE_BASED) {
    const { collaterizationRate } = order.borrowNft.classicParams.priceBased;

    const liquidationPrice =
      loanValue + loanValue * (collaterizationRate / 100);

    fields.push({
      title: 'Liquidation price',
      value: (liquidationPrice / 1e9)?.toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }

  //? PriceBased borrow apy
  if (loanType === LoanType.PRICE_BASED) {
    const { borrowAPRPercent } = order.borrowNft.classicParams.priceBased;

    fields.push({
      title: 'Borrow APY',
      value: borrowAPRPercent.toFixed(0),
      valueType: CARD_VALUES_TYPES.percent,
    });
  }

  //? TimeBased holder discount
  if (loanType === LoanType.TIME_BASED) {
    const feeDiscountPercent =
      order.borrowNft.classicParams.timeBased.feeDiscountPercent;
    feeDiscountPercent &&
      fields.push({
        title: 'Holder discount',
        value: feeDiscountPercent.toFixed(0),
        valueType: CARD_VALUES_TYPES.percent,
      });
  }

  //? TimeBased repay value
  if (loanType === LoanType.TIME_BASED) {
    const repayValue = calcTimeBasedRepayValue({
      nft: order.borrowNft,
      loanValue,
    });

    fields.push({
      title: 'Repay value',
      value: (repayValue / 1e9).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }

  //? Bond repay value
  if (loanType === LoanType.BOND) {
    const fee = calcBondFee({
      loanValue,
      pair,
    });

    fields.push({
      title: 'Repay value',
      value: ((loanValue + fee) / 1e9).toFixed(3),
      valueType: CARD_VALUES_TYPES.solPrice,
    });
  }

  return fields;
};
