import { sum, map, filter } from 'ramda';

import { BulkValues } from '../../hooks';

export const useBorrowBulk = (): {
  getTotalValue: (bulk: BulkValues[]) => number;
} => {
  const getTotalValue = (bulk): number => {
    const priceBased = ({ priceBased }) => priceBased;
    const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
    const timeBased = ({ isPriceBased }) => !isPriceBased;
    const suggestedLoanValue = ({ priceBased }) =>
      priceBased.suggestedLoanValue;

    const priceBasedLoans = filter(priceBased, bulk);
    const timeBasedLoans = filter(timeBased, bulk);

    const priceBasedLoansValue = sum(map(suggestedLoanValue, priceBasedLoans));

    const timeBasedLoansValue = sum(map(maxLoanValue, timeBasedLoans));

    return priceBasedLoansValue + timeBasedLoansValue || 0;
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
