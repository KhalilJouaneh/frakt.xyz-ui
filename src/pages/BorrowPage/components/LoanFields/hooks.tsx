import { useState } from 'react';
import { BorrowNft } from '../../../../state/loans/types';

export const useLoanFields = (nft: BorrowNft) => {
  const { valuation, timeBased } = nft;

  const valuationNumber = parseFloat(valuation);
  const maxLoanValueNumber = valuationNumber * (timeBased.ltvPercents / 100);
  const minLoanValueNumber = valuationNumber / 10;

  const [solLoanValue, setSolLoanValue] = useState<number>(0);

  const marks: { [key: number]: string | JSX.Element } = {
    [minLoanValueNumber]: `${minLoanValueNumber.toFixed(2)} SOL`,
    [maxLoanValueNumber]: `${maxLoanValueNumber.toFixed(2)} SOL`,
  };

  const loanTypeOptions = [
    {
      //   label: `${timeBased.returnPeriodDays} day`,
      label: 'flip',
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
    solLoanValue,
    setSolLoanValue,
    loanTypeOptions,
    ltv,
  };
};

export enum Risk {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

const getRisk = ({
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
