import { uniq, maxBy } from 'lodash';

import { Market, Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/nft';

import { BorrowNftSelected } from '../../../selectedNftsState';

export interface SelectValue {
  label: string;
  value: {
    type: LoanType;
    duration?: number; //? Doesn't Exist for LoanType.PRICE_BASED
  };
}

type GenerateSelectOptions = (props: {
  nft: BorrowNftSelected;
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
      label: `${nft.timeBased.returnPeriodDays} days`,
      value: {
        type: LoanType.TIME_BASED,
        duration: nft.timeBased.returnPeriodDays,
      },
    },
  ];

  if (nft?.priceBased) {
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

type GetBorrowValueRange = (props: {
  nft: BorrowNftSelected;
  bondsParams?: {
    pairs: Pair[];
    market: Market;
    duration: number; //? Days
  };
}) => [number, number];
export const getBorrowValueRange: GetBorrowValueRange = ({
  nft,
  bondsParams,
}) => {
  const { valuation: rawValuation, timeBased, loanType } = nft;

  const valuation = parseFloat(rawValuation);

  const maxBorrowValueTimeBased = valuation * (timeBased?.ltvPercents / 100);
  const maxBorrowValuePriceBased =
    valuation * (nft?.priceBased?.ltvPercents / 100);
  const minBorrowValue = valuation / 10;

  const maxBorrowValue = (() => {
    if (loanType === LoanType.PRICE_BASED) return maxBorrowValuePriceBased;
    if (loanType === LoanType.TIME_BASED) return maxBorrowValueTimeBased;

    //? LoanType.BONDS
    return getPairMaxValue({
      pair: getPairWithMaxBorrowValue({
        pairs: bondsParams.pairs,
        collectionFloor: bondsParams.market.oracleFloor.floor / 1e9,
        duration: bondsParams?.duration,
      }),
      collectionFloor: bondsParams.market.oracleFloor.floor / 1e9,
    });
  })();

  return [Math.min(minBorrowValue, maxBorrowValue), maxBorrowValue];
};

type PairLoanDurationFilter = (props: {
  pair: Pair;
  duration?: number;
}) => boolean;
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7, //? Days
}) => duration * (24 * 60 * 60) === pair.validation.durationFilter;

type GetPairWithMaxBorrowValue = (params: {
  pairs: Pair[];
  collectionFloor: number;
  duration?: number;
}) => Pair;
export const getPairWithMaxBorrowValue: GetPairWithMaxBorrowValue = ({
  pairs,
  collectionFloor,
  duration = 7, //? Days
}) => {
  const suitablePairsByDuration = pairs.filter((p) =>
    pairLoanDurationFilter({ pair: p, duration }),
  );

  const pairWithMaxBorrowValue = maxBy(suitablePairsByDuration, (p) =>
    getPairMaxValue({ pair: p, collectionFloor }),
  );

  return pairWithMaxBorrowValue;
};

type GetPairMaxValue = (params: {
  pair: Pair;
  collectionFloor: number;
}) => number;
const getPairMaxValue: GetPairMaxValue = ({ pair, collectionFloor }) => {
  const loanToValueLamports =
    collectionFloor * 1e9 * (pair.validation.loanToValueFilter / 1e4);
  const maxValueBonds = Math.min(
    pair.edgeSettlement,
    loanToValueLamports / 1e3,
  );
  return (maxValueBonds * pair.currentSpotPrice) / 1e9;
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
      const borrowValueBonds = (borrowValue * 1e9) / pair.currentSpotPrice;
      const loanToValueLamports =
        valuation * 1e9 * (pair.validation.loanToValueFilter * 0.01 * 0.01);

      return (
        borrowValueBonds <= pair.edgeSettlement &&
        loanToValueLamports >= borrowValueBonds * 1e3
      );
    },
  );

  return maxBy(
    suitableBySettlementAndValidation,
    (pair) => pair.currentSpotPrice,
  );
};
