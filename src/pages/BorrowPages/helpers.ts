import { BorrowNft } from '@frakt/api/nft';
import { BOND_DECIMAL_DELTA } from '@frakt/utils/bonds';
import { Pair } from '@frakt/api/bonds';

type CalcLtv = (props: { nft: BorrowNft; loanValue: number }) => number;
export const calcLtv: CalcLtv = ({ nft, loanValue }) => {
  const ltv = (loanValue / nft.valuation) * 100;

  return ltv;
};

type CalcPriceBasedUpfrontFee = (props: { loanValue: number }) => number;
export const calcPriceBasedUpfrontFee: CalcPriceBasedUpfrontFee = ({
  loanValue,
}) => {
  return loanValue * 0.01;
};

type CalcTimeBasedRepayValue = (props: {
  nft: BorrowNft;
  loanValue: number;
}) => number;
export const calcTimeBasedRepayValue: CalcTimeBasedRepayValue = ({
  nft,
  loanValue,
}) => {
  const { fee, feeDiscountPercent } = nft.classicParams.timeBased;

  const feeAmount = loanValue * (fee / loanValue);

  const feeAmountWithDiscount =
    feeAmount - feeAmount * (feeDiscountPercent / 100);

  return loanValue + feeAmountWithDiscount;
};

type CalcBondFee = (props: { loanValue: number; pair: Pair }) => number;
export const calcBondFee: CalcBondFee = ({ loanValue, pair }) => {
  const { currentSpotPrice } = pair;

  const feeLamports =
    (loanValue * BOND_DECIMAL_DELTA) / currentSpotPrice - loanValue;

  return feeLamports;
};

// export const calcBulkTotalValue = (bulk: Array<BorrowNftSuggested>) => {
//   const priceBasedLoans = filter(
//     bulk,
//     (nft) => nft?.loanType === LoanType.PRICE_BASED,
//   );
//   const timeBasedLoans = filter(
//     bulk,
//     (nft) => nft?.loanType === LoanType.TIME_BASED,
//   );

//   const priceBasedLoansValue =
//     sum(map(priceBasedLoans, (nft) => nft?.priceBasedSuggestion?.loandValue)) ||
//     0;

//   const timeBasedLoansValue =
//     sum(
//       map(
//         timeBasedLoans,
//         ({ borrowNft }) => borrowNft?.classicParams?.timeBased?.loanValue,
//       ),
//     ) || 0;

//   return priceBasedLoansValue + timeBasedLoansValue;
// };

// export const calcFeePerDayForTimeBasedLoan = (nft: BorrowNft, ltv: number) => {
//   const { ltvPercent, fee, feeDiscountPercent, returnPeriodDays } =
//     nft?.classicParams?.timeBased;

//   const timeBasedLtvValue = ltvPercent / 100;
//   const suggestedLtvValue = ltv / 100;

//   const feeAmount = (fee / timeBasedLtvValue) * suggestedLtvValue;

//   const feeDiscountPercentsValue = feeDiscountPercent * 0.01;

//   const feePerDay = feeAmount / returnPeriodDays;
//   const feePerDayWithDiscount =
//     feePerDay - feePerDay * feeDiscountPercentsValue;

//   return feePerDayWithDiscount;
// };

// export const calcFeesForPriceBasedLoan = (nft: BorrowNft, ltv: number) => {
//   if (!ltv || !nft?.classicParams?.priceBased)
//     return { feePerDay: 0, upfrontFee: 0 };

//   const { valuation, classicParams } = nft;
//   const priceBased = classicParams.priceBased;

//   const loanValue = valuation * (ltv / 100);

//   const feePerDay = (loanValue * (priceBased.borrowAPRPercent * 0.01)) / 365;
//   const upfrontFee = loanValue * 0.01;

//   return { feePerDay, upfrontFee };
// };

// export const calcFeePerDay = (selectedBulk: BorrowNftSuggested[]): number => {
//   return sum(
//     selectedBulk.map((suggestion): number => {
//       const { borrowNft, loanType, priceBasedSuggestion } = suggestion;

//       if (loanType === LoanType.PRICE_BASED) {
//         const suggestedLtv =
//           (priceBasedSuggestion.loandValue / borrowNft.valuation) * 100;
//         const priceBasedLtv = borrowNft?.classicParams?.priceBased?.ltvPercent;

//         return calcFeesForPriceBasedLoan(
//           borrowNft,
//           suggestedLtv || priceBasedLtv,
//         ).feePerDay;
//       }

//       const timeBasedLtv = borrowNft?.classicParams?.timeBased?.ltvPercent;
//       return calcFeePerDayForTimeBasedLoan(borrowNft, timeBasedLtv);
//     }),
//   );
// };

// export const getFeesOnCertainDay = (selectedBulk: Order[], day: number) => {
//   const filteredLoans = selectedBulk.filter(({ loanType, borrowNft }) => {
//     return (
//       loanType === LoanType.PRICE_BASED ||
//       day <= borrowNft?.classicParams?.timeBased.returnPeriodDays
//     );
//   });

//   return calcFeePerDay(filteredLoans) * day;
// };
