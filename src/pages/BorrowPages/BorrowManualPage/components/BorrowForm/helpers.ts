import { uniq, maxBy } from 'lodash';

import { Market, Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';
import { BOND_DECIMAL_DELTA, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { BorrowNft } from '@frakt/api/nft';

import {
  getPairMaxBorrowValue,
  getPairWithMaxBorrowValue,
} from '../../../cartState';

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number | null; //? Doesn't Exist for LoanType.PRICE_BASED
  };
}

type CalcLtv = (props: { nft: BorrowNft; loanValue: number }) => number;
export const calcLtv: CalcLtv = ({ nft, loanValue }) => {
  const ltv = (loanValue / nft.valuation) * 100;

  return ltv;
};

type CalcTimeBasedRepayValue = (props: {
  nft: BorrowNft;
  loanValue: number;
}) => number;
export const calcTimeBasedRepayValue: CalcTimeBasedRepayValue = ({
  nft,
  loanValue,
}) => {
  const { fee, feeDiscountPercent } = nft.classicParams.timeBased;

  const feeAmount = loanValue * (fee / loanValue);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return loanValue + feeAmountWithDiscount;
};

type CalcPriceBasedUpfrontFee = (props: { loanValue: number }) => number;
export const calcPriceBasedUpfrontFee: CalcPriceBasedUpfrontFee = ({
  loanValue,
}) => {
  return loanValue * 0.01;
};

type CalcBondFee = (props: { loanValue: number; pair: Pair }) => number;
export const calcBondFee: CalcBondFee = ({ loanValue, pair }) => {
  const { currentSpotPrice } = pair;

  const feeLamports =
    (loanValue * BOND_DECIMAL_DELTA) / currentSpotPrice - loanValue;

  return feeLamports;
};

type GetBorrowValueRange = (props: {
  nft: BorrowNft;
  loanType: LoanType;
  bondsParams?: {
    pairs: Pair[];
    market: Market;
    duration: number; //? Days
  };
}) => [number, number];
export const getBorrowValueRange: GetBorrowValueRange = ({
  nft,
  loanType,
  bondsParams,
}) => {
  const { valuation, classicParams } = nft;

  const maxBorrowValueTimeBased =
    valuation * (classicParams?.timeBased?.ltvPercent / 100);
  const maxBorrowValuePriceBased =
    valuation * (classicParams?.priceBased?.ltvPercent / 100);
  const minBorrowValue = valuation / 10;

  const maxBorrowValue = (() => {
    if (loanType === LoanType.PRICE_BASED) return maxBorrowValuePriceBased;
    if (loanType === LoanType.TIME_BASED) return maxBorrowValueTimeBased;

    const maxBorrowValuePair = getPairWithMaxBorrowValue({
      pairs: bondsParams?.pairs,
      collectionFloor: bondsParams?.market?.oracleFloor?.floor,
      duration: bondsParams?.duration,
    });

    if (!maxBorrowValuePair) {
      return 0;
    }

    //? LoanType.BONDS
    return getPairMaxBorrowValue({
      pair: maxBorrowValuePair,
      collectionFloor: bondsParams.market.oracleFloor.floor,
    });
  })();

  return [Math.min(minBorrowValue, maxBorrowValue), maxBorrowValue];
};

type GenerateSelectOptions = (props: {
  nft: BorrowNft;
  bondsParams?: {
    pairs: Pair[];
  };
}) => SelectValue[];
export const generateSelectOptions: GenerateSelectOptions = ({
  nft,
  bondsParams,
}) => {
  const options: SelectValue[] = [
    {
      label: `${nft?.classicParams?.timeBased.returnPeriodDays} days`,
      value: {
        type: LoanType.TIME_BASED,
        duration: nft?.classicParams?.timeBased.returnPeriodDays,
      },
    },
  ];

  if (nft?.classicParams?.priceBased) {
    options.push({
      label: 'Perpetual',
      value: {
        type: LoanType.PRICE_BASED,
        duration: null,
      },
    });
  }

  if (bondsParams?.pairs) {
    const availablePeriods = uniq(
      bondsParams?.pairs.map(
        (pair) => pair?.validation?.durationFilter / (24 * 60 * 60),
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

type GetCheapestPairForBorrowValue = (params: {
  borrowValue: number;
  valuation: number;
  pairs: Pair[];
  duration: number;
}) => Pair;
export const getCheapestPairForBorrowValue: GetCheapestPairForBorrowValue = ({
  borrowValue,
  valuation,
  pairs,
  duration,
}) => {
  const suitablePairsByDuration = pairs.filter((p) =>
    pairLoanDurationFilter({ pair: p, duration }),
  );

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter(
    (pair) => {
      const borrowValueBonds = borrowValue / pair.currentSpotPrice;
      const loanToValueLamports =
        valuation * (pair.validation.loanToValueFilter * 0.01 * 0.01);

      return (
        borrowValueBonds <= pair.edgeSettlement &&
        loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA
      );
    },
  );

  return maxBy(
    suitableBySettlementAndValidation,
    (pair) => pair.currentSpotPrice,
  );
};
