import { BorrowNft } from '../../../../state/loans/types';
import { getLiquidationValues } from './helpers';

export const useLoanFields = (
  nft: BorrowNft,
  solLoanValue?: number,
  selectValue?: string,
) => {
  const { valuation, timeBased } = nft;

  const valuationNumber = parseFloat(valuation);
  const maxLoanValueNumber = valuationNumber * (timeBased?.ltvPercents / 100);
  const maxLoanPriceValueNumber =
    valuationNumber * (nft?.priceBased?.ltvPercents / 100);
  const minLoanValueNumber = valuationNumber / 10;

  const maxLoanValue =
    selectValue === 'flip' ? maxLoanValueNumber : maxLoanPriceValueNumber;

  const marks: { [key: number]: string | JSX.Element } = {
    [minLoanValueNumber]: `${minLoanValueNumber.toFixed(2)} SOL`,
    [maxLoanValue]: `${maxLoanValue.toFixed(2)} SOL`,
  };

  const averageLoanValue = (maxLoanValue + minLoanValueNumber) / 2;

  const loanTypeOptions = [
    {
      label: `${timeBased.returnPeriodDays} days`,
      value: 'flip',
    },
    {
      label: 'Perpetual',
      value: 'perpetual',
      disabled: !nft?.priceBased,
    },
  ];

  const { liquidationPrice, liquidationDrop } = getLiquidationValues(
    nft,
    solLoanValue,
  );

  return {
    marks,
    maxLoanValue,
    minLoanValueNumber,
    liquidationPrice,
    liquidationDrop,
    loanTypeOptions,
    averageLoanValue,
  };
};

export enum Risk {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export const getRisk = ({
  LTV,
  limits,
}: {
  LTV: number;
  limits: [number, number];
}): Risk => {
  const riskPercent = (LTV - limits[0]) / (limits[1] - limits[0]);

  if (riskPercent <= 0.5) return Risk.Low;
  if (riskPercent < 0.875) return Risk.Medium;
  return Risk.High;
};
