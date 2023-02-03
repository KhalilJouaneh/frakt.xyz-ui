import { maxBy } from 'lodash';

import { Market, Pair } from '@frakt/api/bonds';
import { BOND_DECIMAL_DELTA, pairLoanDurationFilter } from '@frakt/utils/bonds';
import { LoanType } from '@frakt/api/loans';

import { Order } from './types';

type GetPairMaxBorrowValue = (params: {
  pair: Pair;
  collectionFloor: number;
}) => number; //? lamports
export const getPairMaxBorrowValue: GetPairMaxBorrowValue = ({
  pair,
  collectionFloor,
}) => {
  const loanToValueLamports =
    collectionFloor * (pair.validation.loanToValueFilter / 1e4);
  const maxValueBonds = Math.min(
    pair.edgeSettlement,
    loanToValueLamports / BOND_DECIMAL_DELTA,
  );
  return maxValueBonds * pair.currentSpotPrice;
};

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
    getPairMaxBorrowValue({ pair: p, collectionFloor }),
  );

  return pairWithMaxBorrowValue;
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

type GetBorrowValueRange = (props: {
  order: Order;
  bondsParams?: {
    pairs: Pair[];
    market: Market;
    duration: number; //? Days
  };
}) => [number, number];
export const getBorrowValueRange: GetBorrowValueRange = ({
  order,
  bondsParams,
}) => {
  const { loanType, borrowNft } = order;

  const { valuation, classicParams } = borrowNft;

  const maxBorrowValueTimeBased =
    valuation * (classicParams?.timeBased?.ltvPercent / 100);
  const maxBorrowValuePriceBased =
    valuation * (classicParams?.priceBased?.ltvPercent / 100);
  const minBorrowValue = valuation / 10;

  const maxBorrowValue = (() => {
    if (loanType === LoanType.PRICE_BASED) return maxBorrowValuePriceBased;
    if (loanType === LoanType.TIME_BASED) return maxBorrowValueTimeBased;

    //? LoanType.BONDS
    return getPairMaxBorrowValue({
      pair: getPairWithMaxBorrowValue({
        pairs: bondsParams.pairs,
        collectionFloor: bondsParams.market.oracleFloor.floor,
        duration: bondsParams?.duration,
      }),
      collectionFloor: bondsParams.market.oracleFloor.floor,
    });
  })();

  return [Math.min(minBorrowValue, maxBorrowValue), maxBorrowValue];
};
