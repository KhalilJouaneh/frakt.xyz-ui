export interface GraceListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  isPriceBased: boolean;
  loanValue: number;
  liquidationPrice: number;
  liquidationPriceLamports: string;
  valuation: number;
  startedAt: string;
  expiredAt: string;
}

export interface FetchItemsParams {
  sortBy?: string;
  sort?: string;
  search?: string;
  collections?: string;
  user?: string;
}
export interface RaffleListItem {
  rafflePubKey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
  tickets: number;
  expiredAt: string;
}
export interface WonRaffleListItem {
  pubkey: string;
  nftMint: string;
  nftName: string;
  nftImageUrl: string;
  nftCollectionName: string;
  nftFloorPrice: number; //? 1.23 (SOL)
  liquidationPrice: number; //? 1.23 (SOL)
  liquidationPriceBN: string;
  user: string;
}

export type FetchRaffleHistory = (props: {
  query: string;
}) => Promise<WonRaffleListItem[]>;

export type FetchGraceRaffle = (props: {
  query: string;
}) => Promise<GraceListItem[]>;

export type FetchLiquidationRaffle = (props: {
  query: string;
  publicKey?: string;
}) => Promise<RaffleListItem[]>;
