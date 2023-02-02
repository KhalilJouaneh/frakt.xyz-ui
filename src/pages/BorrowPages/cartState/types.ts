import { Market } from '@frakt/api/bonds';
import { BorrowNftSuggested } from '@frakt/api/nft';

export interface BondParams {
  spotPrice: number;
  pairPubkey: string;
  market: Market;
}

export interface Order extends BorrowNftSuggested {
  loanValue: number; //? lamports

  bondParams?: BondParams;
}
