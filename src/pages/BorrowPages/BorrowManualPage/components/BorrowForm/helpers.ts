import { BorrowNftSelected } from '../../../selectedNftsState';

export const generateSelectOptions = (
  nft: BorrowNftSelected,
): Array<{ label: string; value: 'timeBased' | 'priceBased' }> => {
  const options = [];
  options.push({
    label: `${nft.timeBased.returnPeriodDays} days`,
    value: 'timeBased',
  });
  if (nft?.priceBased) {
    options.push({ label: 'Perpetual', value: 'priceBased' });
  }
  return options;
};

export const getBorrowValueRange = (
  nft: BorrowNftSelected,
): [number, number] => {
  const { valuation: rawValuation, timeBased, isPriceBased } = nft;

  const valuation = parseFloat(rawValuation);

  const maxBorrowValueTimeBased = valuation * (timeBased?.ltvPercents / 100);
  const maxBorrowValuePriceBased =
    valuation * (nft?.priceBased?.ltvPercents / 100);
  const minBorrowValue = valuation / 10;
  const maxBorrowValue = isPriceBased
    ? maxBorrowValuePriceBased
    : maxBorrowValueTimeBased;

  return [minBorrowValue, maxBorrowValue];
};
