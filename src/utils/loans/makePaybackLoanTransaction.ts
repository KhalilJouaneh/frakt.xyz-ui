import { web3, loans, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan } from '@frakt/api/loans';

const { paybackLoanWithGraceIx, paybackLoanIx } = loans;

type MakePaybackLoanTransaction = (params: {
  loan: Loan;
  paybackAmount?: BN;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{ transaction: web3.Transaction; signers: web3.Signer[] }>;

export const makePaybackLoanTransaction: MakePaybackLoanTransaction = async ({
  connection,
  wallet,
  loan,
  paybackAmount,
}) => {
  const instructions = await (async () => {
    if (!loan.gracePeriod) {
      const { ixs: instructions } = await paybackLoanIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet?.publicKey,
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        loan: new web3.PublicKey(loan.pubkey),
        nftMint: new web3.PublicKey(loan.nft.mint),
        liquidityPool: new web3.PublicKey(loan.classicParams.liquidityPool),
        collectionInfo: new web3.PublicKey(loan.classicParams.collectionInfo),
        royaltyAddress: new web3.PublicKey(loan.classicParams.royaltyAddress),
        nftUserTokenAccount: new web3.PublicKey(
          loan.classicParams.nftUserTokenAccount,
        ),
        paybackAmount,
      });
      return instructions;
    } else {
      const { ixs: instructions } = await paybackLoanWithGraceIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        liquidationLot: new web3.PublicKey(loan.gracePeriod.liquidationLot),
        loan: new web3.PublicKey(loan.pubkey),
        nftMint: new web3.PublicKey(loan.nft.mint),
        liquidityPool: new web3.PublicKey(loan.classicParams.liquidityPool),
        collectionInfo: new web3.PublicKey(loan.classicParams.collectionInfo),
        royaltyAddress: new web3.PublicKey(loan.classicParams.royaltyAddress),
      });
      return instructions;
    }
  })();

  return {
    transaction: new web3.Transaction().add(...instructions),
    signers: [],
  };
};
