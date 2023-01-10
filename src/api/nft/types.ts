export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  isCanFreeze: boolean;
  marketPubkey?: string;
  timeBased: {
    returnPeriodDays: number; // 14
    ltvPercents: number; // 40
    fee: string; // 0.100
    feeDiscountPercents: string; // 2
    repayValue: string; // 1.101
    liquidityPoolPubkey: string;
    loanValue: string; // 1.020
    isCanStake: boolean;
  };
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40
    borrowAPRPercents: number; // 10
    collaterizationRate: number; // 10(%)
    isCanStake: boolean;
  };
}

export interface BorrowNftBulk extends BorrowNft {
  solLoanValue?: number;
  isPriceBased?: boolean;
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number;
    borrowAPRPercents: number;
    collaterizationRate: number;
    isCanStake: boolean;
    ltv?: number;
    suggestedLoanValue?: number;
  };
}

export enum BulkTypes {
  best = 'best',
  cheapest = 'cheapest',
  safest = 'safest',
  max = 'max',
}

export type BulkSuggestion = {
  [key in BulkTypes]?: BorrowNftBulk[];
};
