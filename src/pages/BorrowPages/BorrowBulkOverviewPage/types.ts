import { LoanType } from '@frakt/api/loans';

export enum CARD_VALUES_TYPES {
  string = 'string',
  percent = 'percent',
  solPrice = 'solPrice',
}

export interface LoanCardValue {
  title: string;
  value: number | string;
  valueType?: CARD_VALUES_TYPES;
}

type LoanTypeName = {
  [key in LoanType]?: string;
};

export const LOAN_TYPE_NAME: LoanTypeName = {
  [LoanType.BOND]: 'Bond',
  [LoanType.PRICE_BASED]: 'Perpetual',
  [LoanType.TIME_BASED]: 'Flip',
};
