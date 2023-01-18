export interface LiquidityPool {
  pubkey: string;
  isPriceBased: boolean;
  name: string;
  imageUrl: string[];

  totalLiquidity: number;
  totalBorrowed: number;

  utilizationRate: number;
  depositApr: number;
  borrowApr?: number;

  activeloansAmount: number;

  collectionsAmount: number;

  userDeposit?: {
    pubkey: string;
    harvestAmount: number;
    depositAmount: number;
    depositAmountLamports: string; //? Lamports
  };
  userActiveLoansAmount?: number;
}

export interface Loan {
  pubkey: string;
  mint: string;
  name: string;
  collectionName: string;
  imageUrl: string;
  isPriceBased: boolean;

  loanValue: number; //? SOL
  repayValue: number; //? SOL
  repayValueLamports: string; //? Lamports

  startedAt: string; //? Date
  expiredAt?: string; //? Date
  isGracePeriod?: boolean;

  liquidationLot?: string; //? For GracePeriod loans only

  liquidityPool: string;
  collectionInfo: string;
  royaltyAddress: string;

  liquidationPrice?: number; //? 1.23456 (SOL)
  realLiquidationPrice?: number;
  valuation?: number; //? 1.23456 (SOL)
  health?: number; //? 80(%) 0-100%
  nftOriginalPrice?: number;
  borrowAPRPercents?: number;

  reward?: {
    stakeState: string;
    amount: number;
    token: string;
  };
}

export interface PerpetualNftsInfo {
  solLoanValue: number;
  ltv: number;
  mint: string;
  type: string;
}
