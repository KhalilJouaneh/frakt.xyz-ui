export enum LoanType {
  TIME_BASED = 'timeBased',
  PRICE_BASED = 'priceBased',
  BOND = 'bond',
}

export enum RewardState {
  STAKED = 'staked',
  UNSTAKED = 'unstaked',
}

export interface Loan {
  pubkey: string;
  loanType: LoanType;

  loanValue: number; //? Lamports
  repayValue: number; //? Lamports

  startedAt: number; //? unix timestamp

  gracePeriod?: {
    startedAt: number; //? unix timestamp
    expiredAt: number; //? unix timestamp
    liquidationLot?: string; //? For classic loans only
  };

  nft: {
    mint: string;
    name: string;
    collectionName: string;
    imageUrl: string;
  };

  classicParams?: {
    nftUserTokenAccount: string;
    liquidityPool: string;
    collectionInfo: string;
    royaltyAddress: string;

    timeBased?: {
      expiredAt: number; //? unix timestamp
    };

    priceBased?: {
      nftOriginalPrice: number; //? Lamports
      liquidationPrice: number; //? Lamports
      health: number; //? 80(%) 0-100%
      borrowAPRPercent: number; //? 80(%) 0-100%
    };

    rewards?: {
      stakeState: RewardState;
      amount: number; //? Lamports
      token: string;
    };
  };

  bondParams?: {
    bondTokenMint: string;
    collateralOrSolReceiver: string;
    collateralTokenAccount: string;
    expiredAt: number; //? unix timestamp
  };
}
