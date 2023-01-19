import { Market, Pair } from '../bonds';

interface BorrowNftTimeBasedParams {
  returnPeriodDays: number; // 14
  ltvPercents: number; // 40
  fee: string; // 0.100
  feeDiscountPercents: string; // 2
  repayValue: string; // 1.101
  liquidityPoolPubkey: string;
  loanValue: string; // 1.020
  isCanStake: boolean;
}

interface BorrowNftPriceBasedParams {
  liquidityPoolPubkey: string;
  ltvPercents: number; // 40
  borrowAPRPercents: number; // 10
  collaterizationRate: number; // 10(%)
  isCanStake: boolean;
}

export interface BorrowNftBondParams {
  market: Market;
  pair: Pair;
}

interface BorrowNftPriceBasedParamsSuggested extends BorrowNftPriceBasedParams {
  suggestedLoanValue: number;
}

export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  isCanFreeze: boolean;
  marketPubkey?: string; //TODO
  timeBased: BorrowNftTimeBasedParams;
  priceBased?: BorrowNftPriceBasedParams;
}

export interface BorrowNftSuggested extends BorrowNft {
  loanType: LoanType;
  priceBased?: BorrowNftPriceBasedParamsSuggested;
  bondParams?: BorrowNftBondParams;
}

export enum BulkTypes {
  best = 'best',
  cheapest = 'cheapest',
  safest = 'safest',
  max = 'max', //? Exists when the user wants to borrow more than he has
}

export type BulkSuggestion = {
  [key in BulkTypes]?: BorrowNftSuggested[];
};

export enum LoanType {
  TIME_BASED = 'timeBased',
  PRICE_BASED = 'priceBased',
  BOND = 'bond',
}
