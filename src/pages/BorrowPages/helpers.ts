import { filter, sum, map } from 'lodash';

import { BorrowNft, BorrowNftBulk } from '@frakt/api/nft';

export const calcBulkTotalValue = (bulk: BorrowNftBulk[]) => {
  const priceBasedLoans: BorrowNftBulk[] = filter(
    bulk,
    (nft) => nft?.isPriceBased,
  );
  const timeBasedLoans: BorrowNftBulk[] = filter(
    bulk,
    (nft) => !nft?.isPriceBased,
  );

  const priceBasedLoansValue =
    sum(map(priceBasedLoans, (nft) => nft?.priceBased.suggestedLoanValue)) || 0;

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

export const calcFeePerDay = (selectedBulk: BorrowNftBulk[]): number => {
  return sum(
    selectedBulk.map((nft): number => {
      const { valuation, timeBased } = nft;
      const valuationNumber = parseFloat(valuation);

      const suggestedLoanValue = nft?.priceBased?.suggestedLoanValue;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;

      const rawLtv = (nft?.solLoanValue / valuationNumber) * 100;

      const timeBasedLtv = timeBased.ltvPercents;
      const priceBasedLtv = nft?.priceBased?.ltvPercents;

      const ltv =
        rawLtv || suggestedLtvPersent || priceBasedLtv || timeBasedLtv;

      if (nft.isPriceBased) {
        return calcFeesForPriceBasedLoan(nft, ltv).feePerDay;
      }

      return calcFeePerDayForTimeBasedLoan(nft, ltv);
    }),
  );
};

export const getFeesOnCertainDay = (
  selectedBulk: BorrowNftBulk[],
  day: number,
) => {
  const filteredLoans = selectedBulk.filter(
    ({ isPriceBased, timeBased }) =>
      isPriceBased || day <= timeBased.returnPeriodDays,
  );

  return calcFeePerDay(filteredLoans) * day;
};
