import { Market, Pair } from '../bonds';
import { LoanType } from '../loans';

export interface BorrowNft {
  mint: string;
  name: string;
  collectionName: string;
  imageUrl: string;

  valuation: number; // lamports
  freezable: boolean;
  stakingAvailable: boolean;

  classicParams?: {
    maxLoanValue: number; // lamports
    timeBased: {
      liquidityPoolPubkey: string;
      returnPeriodDays: number; // 14 (days)
      ltvPercent: number; // 40 (%)
      fee: number; // lamports
      feeDiscountPercent: number; // 2 (%)

      loanValue: number; // lamports
      repayValue: number; // lamports
    };
    priceBased?: {
      liquidityPoolPubkey: string;
      ltvPercent: number; // 40 (%)
      borrowAPRPercent: number; // 10 (%)
      collaterizationRate: number; // 10(%)
    };
  };

  bondParams?: {
    marketPubkey: string;
  };
}

export interface BondOrderParams {
  orderSize: number; //? lamports
  spotPrice: number; //? lamports
  pairPubkey: string;
}

export interface BorrowNftSuggested {
  loanType: LoanType;
  loanValue: number; //? lamports. Max for timeBased, selected for priceBased and Bonds

  borrowNft: BorrowNft;

  bondOrderParams?: BondOrderParams[];
}

export enum BulkTypes {
  best = 'best',
  cheapest = 'cheapest',
  safest = 'safest',
  max = 'max', //? Exists when the user wants to borrow more than he has
}

export interface Suggestion {
  orders: BorrowNftSuggested[];
  markets: Market[];
  modifiedPairs: Pair[];
}

export type BulkSuggestion = {
  [key in BulkTypes]?: Suggestion;
};
