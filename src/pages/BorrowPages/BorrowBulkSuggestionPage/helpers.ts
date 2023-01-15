import { filter, sum, map } from 'lodash';

import { BorrowNftBulk } from '@frakt/api/nft';

export const calcBulkTotalValue = (bulk: BorrowNftBulk[]): number => {
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
