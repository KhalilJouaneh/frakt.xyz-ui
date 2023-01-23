import { filter, sum, map } from 'lodash';

import { BorrowNft, BorrowNftSuggested } from '@frakt/api/nft';
import { LoanType } from '@frakt/api/loans';

import { BorrowNftSelected } from './selectedNftsState';

export const calcBulkTotalValue = (
  bulk: Array<BorrowNftSuggested | BorrowNftSelected>,
) => {
  const priceBasedLoans = filter(
    bulk,
    (nft) => nft?.loanType === LoanType.PRICE_BASED,
  );
  const timeBasedLoans = filter(
    bulk,
    (nft) => nft?.loanType === LoanType.TIME_BASED,
  );

  const priceBasedLoansValue =
    sum(
      map(
        priceBasedLoans,
        (nft) => (nft?.priceBased as any)?.suggestedLoanValue,
      ),
    ) || 0;

  const timeBasedLoansValue =
    sum(map(timeBasedLoans, ({ maxLoanValue }) => parseFloat(maxLoanValue))) ||
    0;

  return priceBasedLoansValue + timeBasedLoansValue;
};

export const calcFeePerDayForTimeBasedLoan = (nft: BorrowNft, ltv: number) => {
  const { returnPeriodDays, fee, feeDiscountPercents, ltvPercents } =
    nft.timeBased;

  const timeBasedLtvValue = ltvPercents / 100;
  const suggestedLtvValue = ltv / 100;

  const feeAmount = (Number(fee) / timeBasedLtvValue) * suggestedLtvValue;

  const feeDiscountPercentsValue = Number(feeDiscountPercents) * 0.01;

  const feePerDay = feeAmount / returnPeriodDays;
  const feePerDayWithDiscount =
    feePerDay - feePerDay * feeDiscountPercentsValue;

  return feePerDayWithDiscount;
};

export const calcFeesForPriceBasedLoan = (nft: BorrowNft, ltv: number) => {
  if (!ltv || !nft?.priceBased) return { feePerDay: 0, upfrontFee: 0 };
  const { valuation, priceBased } = nft;

  const loanValue = parseFloat(valuation) * (ltv / 100);

  const feePerDay = (loanValue * (priceBased.borrowAPRPercents * 0.01)) / 365;
  const upfrontFee = loanValue * 0.01;

  return { feePerDay, upfrontFee };
};

export const calcFeePerDay = (selectedBulk: BorrowNftSelected[]): number => {
  return sum(
    selectedBulk.map((nft): number => {
      const { valuation, timeBased } = nft;
      const valuationNumber = parseFloat(valuation);

      const rawLtv = (nft?.solLoanValue / valuationNumber) * 100;

      const timeBasedLtv = timeBased.ltvPercents;
      const priceBasedLtv = nft?.priceBased?.ltvPercents;

      const ltv = rawLtv || priceBasedLtv || timeBasedLtv;

      if (nft.loanType === LoanType.PRICE_BASED) {
        return calcFeesForPriceBasedLoan(nft, ltv).feePerDay;
      }

      return calcFeePerDayForTimeBasedLoan(nft, ltv);
    }),
  );
};

export const getFeesOnCertainDay = (
  selectedBulk: BorrowNftSelected[],
  day: number,
) => {
  const filteredLoans = selectedBulk.filter(({ loanType, timeBased }) => {
    return (
      loanType === LoanType.PRICE_BASED || day <= timeBased.returnPeriodDays
    );
  });

  return calcFeePerDay(filteredLoans) * day;
};
