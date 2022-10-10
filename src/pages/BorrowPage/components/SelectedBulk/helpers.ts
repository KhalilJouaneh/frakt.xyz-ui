const getPriceBasedValues = (
  nft,
): {
  priceBasedLoanValue: string;
  priceBasedFee: string;
  priceBasedLtvPersent: string;
  BorrowAPY: string;
  liquidationsPrice: string;
} => {
  const { valuation, priceBased, maxLoanValue, timeBased } = nft;

  const timeBasedLoanValueNumber = parseFloat(timeBased?.loanValue);

  const valuationNumber = parseFloat(valuation);
  const currentLtvPersent = priceBased?.ltv;
  const suggestedLoanValue = priceBased?.suggestedLoanValue;

  const currentLoanValue = (valuationNumber * currentLtvPersent) / 100;
  const loanValue = currentLoanValue || suggestedLoanValue;

  const fee = Number(maxLoanValue) * 0.01;

  const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;
  const ltv = currentLtvPersent || suggestedLtvPersent;

  const BorrowAPY = priceBased?.borrowAPRPercents;

  const liquidationsPrice =
    timeBasedLoanValueNumber +
    timeBasedLoanValueNumber * (priceBased?.collaterizationRate / 100);

  return {
    priceBasedLoanValue: loanValue?.toFixed(3),
    priceBasedFee: fee?.toFixed(3),
    priceBasedLtvPersent: ltv?.toFixed(0),
    BorrowAPY: BorrowAPY?.toFixed(0),
    liquidationsPrice: liquidationsPrice?.toFixed(3),
  };
};

const getTimeBasedValues = (nft) => {
  const { timeBased } = nft;

  const { fee, feeDiscountPercents, ltvPercents } = timeBased;

  const feeDiscountValue = Number(feeDiscountPercents) * 0.01;

  const timeBasedfeeWithDiscount = Number(fee) - Number(fee) * feeDiscountValue;

  return {
    timeBasedFee: timeBasedfeeWithDiscount.toFixed(3),
    timeBasedLtvPersent: ltvPercents.toFixed(0),
  };
};

export const getSelectedBulkValues = (nft) => {
  const { maxLoanValue: rawMaxLoanValue, isPriceBased } = nft;

  const { timeBasedFee, timeBasedLtvPersent } = getTimeBasedValues(nft);
  const {
    priceBasedLoanValue,
    priceBasedFee,
    priceBasedLtvPersent,
    BorrowAPY,
    liquidationsPrice,
  } = getPriceBasedValues(nft);

  const loanType = isPriceBased ? 'Perpetual' : 'Flip';

  const maxLoanValue = isPriceBased ? priceBasedLoanValue : rawMaxLoanValue;

  const fee = isPriceBased ? priceBasedFee : timeBasedFee;

  const loanToValue = isPriceBased ? priceBasedLtvPersent : timeBasedLtvPersent;

  return {
    loanType,
    maxLoanValue,
    fee,
    loanToValue,
    BorrowAPY,
    liquidationsPrice,
  };
};
