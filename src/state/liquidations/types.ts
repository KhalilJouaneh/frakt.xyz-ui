export interface FetchItemsParams {
  sortBy?: string;
  sort?: string;
  search?: string;
  collections?: string;
  user?: string;
}
export interface RaffleListItem {
  isParticipationExists: boolean;
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

export interface LotteryTicket {
  totalTickets: number;
  currentTickets: number;
}

export interface CollectionsListItem {
  name: string;
}
