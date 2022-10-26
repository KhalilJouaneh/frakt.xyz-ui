import { BorrowNft } from '../../../../state/loans/types';

export const useLoanFields = (nft: BorrowNft, solLoanValue?: number) => {
  const { valuation, timeBased } = nft;

  const valuationNumber = parseFloat(valuation);
  const maxLoanValueNumber = valuationNumber * (timeBased.ltvPercents / 100);
  const minLoanValueNumber = valuationNumber / 10;

  const marks: { [key: number]: string | JSX.Element } = {
    [minLoanValueNumber]: `${minLoanValueNumber.toFixed(2)} SOL`,
    [maxLoanValueNumber]: `${maxLoanValueNumber.toFixed(2)} SOL`,
  };

  const averageLoanValue = (maxLoanValueNumber + minLoanValueNumber) / 2;

  const loanTypeOptions = [
    {
      label: `${timeBased.returnPeriodDays} day`,
      value: 'flip',
    },
    {
      label: 'perpetual',
      value: 'perpetual',
      disabled: !nft?.priceBased,
    },
  ];

  const ltv = (solLoanValue / parseFloat(valuation)) * 100;

  const liquidationPrice =
    solLoanValue + solLoanValue * (nft?.priceBased?.collaterizationRate / 100);

  const liquidationDrop =
    ((parseFloat(valuation) - liquidationPrice) / parseFloat(valuation)) * 100;

  const risk = getRisk({ LTV: ltv, limits: [10, ltv] });

  return {
    risk,
    marks,
    maxLoanValueNumber,
    minLoanValueNumber,
    liquidationPrice,
    liquidationDrop,
    loanTypeOptions,
    averageLoanValue,
    ltv,
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
