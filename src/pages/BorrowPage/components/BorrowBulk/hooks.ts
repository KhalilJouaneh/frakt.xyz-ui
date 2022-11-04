import { BorrowNftBulk } from '@frakt/api/nft';
import { sum, map, filter } from 'ramda';

export const useBorrowBulk = (): {
  getTotalValue: (bulk: BorrowNftBulk[]) => number;
} => {
  const getTotalValue = (bulk: BorrowNftBulk[]): number => {
    const priceBased = (nft: BorrowNftBulk) => nft?.isPriceBased;
    const timeBased = (nft: BorrowNftBulk) => !nft?.isPriceBased;
    const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
    const suggestedLoanValue = (nft: BorrowNftBulk) =>
      nft?.priceBased.suggestedLoanValue;

    const priceBasedLoans: BorrowNftBulk[] = filter(priceBased, bulk);
    const timeBasedLoans: BorrowNftBulk[] = filter(timeBased, bulk);

    const priceBasedLoansValue =
      sum(map(suggestedLoanValue, priceBasedLoans)) || 0;

    const timeBasedLoansValue = sum(map(maxLoanValue, timeBasedLoans)) || 0;

    return priceBasedLoansValue + timeBasedLoansValue;
  };

  return { getTotalValue };
};

export const badgesInfo = {
  best: {
    title: 'Best',
    text: 'Most appropriate to chosen SOL amount',
    color: 'var(--light-green-color)',
  },
  cheapest: {
    title: 'Cheapest',
    text: 'Minimal fees paid',
    color: '#fff61f',
  },
  safest: {
    title: 'Safest',
    text: 'Loans with lowest loan to value ratio',
    color: '#1fc9ff',
  },
};
