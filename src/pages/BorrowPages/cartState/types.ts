import { Market } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';
import {
  BondOrderParams as SuggestedBondOrderParams,
  BorrowNft,
} from '@frakt/api/nft';

export interface BondOrderParams {
  market: Market;
  orderParams: SuggestedBondOrderParams[];
}

//? Almost same as BorrowNftSuggested
export interface Order {
  loanType: LoanType;
  loanValue: number; //? lamports. Max for timeBased, selected for priceBased and Bonds

  borrowNft: BorrowNft;

  bondOrderParams?: BondOrderParams;
}
