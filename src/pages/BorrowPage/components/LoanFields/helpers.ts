import { BorrowNft } from '@frakt/api/nft';

export const feeOnDayForTimeBased = (
  nft: BorrowNft,
  ltv?: number,
): {
  fee: number;
  feeOnDay: number;
} => {
  const { returnPeriodDays, fee, feeDiscountPercents, ltvPercents } =
    nft.timeBased;

  const timeBasedLtvValue = ltvPercents / 100;
  const suggestedLtvValue = ltv / 100;

  const feeAmount = (Number(fee) / timeBasedLtvValue) * suggestedLtvValue;

  const feeDiscountPercentsValue = Number(feeDiscountPercents) * 0.01;

  const feeOnDay = feeAmount / returnPeriodDays;
  const feeOnDayWithDiscount = feeOnDay - feeOnDay * feeDiscountPercentsValue;
  const feeWithDiscount = feeAmount - feeAmount * feeDiscountPercentsValue;

  return {
    fee: feeWithDiscount,
    feeOnDay: feeOnDayWithDiscount,
  };
};

export const feeOnDayForPriceBased = (
  nft: BorrowNft,
  ltv?: number,
): { fee: number; feeOnDay: number } => {
  if (!ltv || !nft?.priceBased) return { feeOnDay: 0, fee: 0 };
  const { valuation, priceBased } = nft;

  const loanValue = parseFloat(valuation) * (ltv / 100);

  const feeOnDay = (loanValue * (priceBased.borrowAPRPercents * 0.01)) / 365;
  const upfrontFee = loanValue * 0.01;

  return { feeOnDay, fee: upfrontFee };
};

export const feeOnDayByType = ({
  nft,
  loanTypeValue,
  ltv,
}: {
  nft: BorrowNft;
  loanTypeValue: string;
  ltv: number;
}) => {
  const isPriceBasedType = loanTypeValue === 'perpetual';

  if (isPriceBasedType) {
    return feeOnDayForPriceBased(nft, ltv);
  } else {
    return feeOnDayForTimeBased(nft, ltv);
  }
};

export const getLiquidationValues = (nft: BorrowNft, solLoanValue: number) => {
  const collaterizationRateValue = nft?.priceBased?.collaterizationRate / 100;
  const valuationNumber = parseFloat(nft.valuation);

  const liquidationPrice =
    solLoanValue + solLoanValue * collaterizationRateValue;

  const liquidationDrop =
    ((valuationNumber - liquidationPrice) / valuationNumber) * 100;

  return {
    liquidationPrice,
    liquidationDrop,
  };
};
