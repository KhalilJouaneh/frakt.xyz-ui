import { web3, loans, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { LoanType } from '@frakt/api/loans';

type MakeProposeTransaction = (params: {
  nftMint: string;
  valuation: number; //? lamports
  loanValue: number; //? lamports
  loanType: LoanType;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makeProposeTransaction: MakeProposeTransaction = async ({
  connection,
  wallet,
  nftMint,
  valuation,
  loanValue,
  loanType,
}) => {
  const loanToValue = (loanValue / valuation) * 1e4;

  const { ix: instruction } = await loans.proposeLoanIx({
    programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
    connection,
    user: wallet.publicKey,
    nftMint: new web3.PublicKey(nftMint),
    proposedNftPrice: new BN(valuation),
    isPriceBased: loanType === LoanType.PRICE_BASED,
    loanToValue: new BN(loanToValue),
    admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
  });
  return {
    transaction: new web3.Transaction().add(instruction),
    signers: [],
  };
};
