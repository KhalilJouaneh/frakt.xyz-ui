import { LoanType } from '../nft';

export interface Loan {
  pubkey: string;
  loanType: LoanType;

  loanValue: number; //? Lamports
  repayValue: number; //? Lamports

  startedAt: number; //? unix timestamp

  isGracePeriod: boolean;

  nft: {
    mint: string;
    name: string;
    collectionName: string;
    imageUrl: string;
  };

  classicParams?: {
    liquidityPool: string;
    collectionInfo: string;
    royaltyAddress: string;
    liquidationLot?: string; //? For GracePeriod loans only

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
      stakeState: 'staked' | 'unstaked';
      amount: number; //? Lamports
      token: string;
    };
  };

  bondParams?: {
    bondTokenMint: string;
    collateralOrSolReceiver: string;
    expiredAt: number; //? unix timestamp
  };
}
