import { uniq } from 'lodash';

import { Market, Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';

import { Order } from '../../../cartState';

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
}

type GenerateSelectOptions = (props: {
  nft: Order;
  bondsParams?: {
    market: Market;
    pairs: Pair[];
  };
}) => SelectValue[];
export const generateSelectOptions: GenerateSelectOptions = ({
  nft,
  bondsParams,
}) => {
  const options: SelectValue[] = [
    {
      label: `${nft.borrowNft?.classicParams?.timeBased.returnPeriodDays} days`,
      value: {
        type: LoanType.TIME_BASED,
        duration: nft.borrowNft?.classicParams?.timeBased.returnPeriodDays,
      },
    },
  ];

  if (nft.borrowNft?.classicParams?.priceBased) {
    options.push({
      label: 'Perpetual',
      value: {
        type: LoanType.PRICE_BASED,
        duration: null,
      },
    });
  }

  if (bondsParams?.market && bondsParams?.pairs) {
    const availablePeriods = uniq(
      bondsParams?.pairs.map(
        (pair) => pair.validation.durationFilter / (24 * 60 * 60),
      ),
    ).sort((a, b) => a - b);

    availablePeriods.forEach((period) => {
      options.push({
        label: `${period} days (bond)`,
        value: {
          type: LoanType.BOND,
          duration: period,
        },
      });
    });
  }

  return options;
};

export const calcLtv = (order: Order) => {
  const { borrowNft, loanValue } = order;
  const ltv = (loanValue / borrowNft.valuation) * 100;

  return ltv;
};

export const calcTimeBasedRepayValue = (order: Order) => {
  const { loanValue } = order;

  const { fee, feeDiscountPercent } = order.borrowNft.classicParams.timeBased;

  const feeAmount = loanValue * (fee / loanValue);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return loanValue + feeAmountWithDiscount;
};

export const calcPriceBasedUpfrontFee = (order: Order) => {
  const { loanValue } = order;

  return loanValue * 0.01;
};

type CalcBondFee = (props: { order: Order; pair: Pair }) => number;
export const calcBondFee: CalcBondFee = ({ order, pair }) => {
  const { loanValue } = order;
  const { currentSpotPrice } = pair;

  const feeLamports = (loanValue * 1e3) / currentSpotPrice - loanValue;

  return feeLamports;
};
