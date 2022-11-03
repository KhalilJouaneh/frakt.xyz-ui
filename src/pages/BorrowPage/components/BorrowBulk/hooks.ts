import { BorrowNftBulk } from '@frakt/api/nft';
import { sum, map, filter } from 'ramda';

export const useBorrowBulk = (): {
  getTotalValue: (bulk: BorrowNftBulk[]) => number;
} => {
  const getTotalValue = (bulk: BorrowNftBulk[]): number => {
    const priceBased = ({ isPriceBased }) => isPriceBased;
    const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
    const timeBased = ({ isPriceBased }) => !isPriceBased;
    const suggestedLoanValue = ({ priceBased }) =>
      priceBased.suggestedLoanValue;

    const priceBasedLoans: BorrowNftBulk[] = filter(priceBased, bulk as any);
    const timeBasedLoans: BorrowNftBulk[] = filter(timeBased, bulk as any);

    const priceBasedLoansValue =
      sum(map(suggestedLoanValue, priceBasedLoans as any)) || 0;

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
