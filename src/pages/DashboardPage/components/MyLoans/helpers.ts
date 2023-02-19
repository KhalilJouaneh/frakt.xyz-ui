import { filter, sum, map } from 'lodash';

import { LiquidityPool } from '@frakt/state/loans/types';
import { Loan } from '@frakt/api/loans';

export const calcLoansAmounts = (userLoans: Loan[]) => {
  const flipLoans = filter(userLoans, { loanType: 'timeBased' });
  const perpetualLoans = filter(userLoans, { loanType: 'priceBased' });
  const bondLoans = filter(userLoans, { loanType: 'bond' });
  const graceLoans = filter(userLoans, 'gracePeriod');

  const flipRepayValue = sum(map(flipLoans, 'repayValue'));
  const perpetualRepayValue = sum(map(perpetualLoans, 'repayValue'));
  const bondRepayValue = sum(map(bondLoans, 'repayValue'));
  const graceLoansValue = sum(map(graceLoans, 'repayValue'));

  return {
    flipRepayValue: flipRepayValue / 1e9,
    perpetualRepayValue: perpetualRepayValue / 1e9,
    bondRepayValue: bondRepayValue / 1e9,
    graceLoansValue: graceLoansValue / 1e9,
    graceLoans,
  };
};

export const calcTotalLoansAmout = (userLoans: Loan[]) => {
  const totalBorrowed = sum(map(userLoans, 'loanValue'));
  const totalDebt = sum(map(userLoans, 'repayValue'));
  const totalLoans = userLoans.length;

  return {
    totalBorrowed: totalBorrowed / 1e9,
    totalDebt: totalDebt / 1e9,
    totalLoans,
  };
};

export const getFilteredPools = (liquidityPools: LiquidityPool[]) => {
  const perpetualPools = filter(liquidityPools, 'isPriceBased');
  const flipPools = filter(liquidityPools, { isPriceBased: false });

  return {
    perpetualPools,
    flipPools,
  };
};

export const getPoolsInfoForView = (
  perpetualPools: LiquidityPool[],
  flipPools: LiquidityPool[],
) => {
  const COUNT_IMAGE_FOR_VIEW = 7;

  const splicedPerpetualPools = perpetualPools.splice(0, 8);
  const poolsImages = map(splicedPerpetualPools, 'imageUrl')?.flat();

  const restFlipPoolImages =
    flipPools[0]?.collectionsAmount - COUNT_IMAGE_FOR_VIEW;

  return { poolsImages, restFlipPoolImages };
};
