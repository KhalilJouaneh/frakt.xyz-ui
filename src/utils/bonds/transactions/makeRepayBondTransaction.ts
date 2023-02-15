import { Loan } from '@frakt/api/loans';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { management } from 'fbonds-core/lib/fbond-protocol/functions';
import { BONDS_ADMIN_PUBKEY, BONDS_PROGRAM_PUBKEY } from '../constants';

type MakeRepayBondTransaction = (params: {
  loan: Loan;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const makeRepayBondTransaction: MakeRepayBondTransaction = async ({
  loan,
  wallet,
  connection,
}) => {
  const { instructions: repayIxs, signers: repaySigners } =
    await management.repayFBond({
      accounts: {
        adminPubkey: BONDS_ADMIN_PUBKEY,
        fbond: new web3.PublicKey(loan.pubkey),
        fbondsTokenMint: new web3.PublicKey(loan.bondParams.bondTokenMint),
        bondCollateralOrSolReceiver: loan.bondParams.collateralOrSolReceiver
          ? new web3.PublicKey(loan.bondParams.collateralOrSolReceiver)
          : undefined,
        userPubkey: wallet.publicKey,
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  const { instructions: getCollateralIxs, signers: getCollateralSigners } =
    await management.getRepaidCollateral({
      accounts: {
        collateralTokenMint: new web3.PublicKey(loan.nft.mint),
        fbond: new web3.PublicKey(loan.pubkey),
        collateralTokenAccount: new web3.PublicKey(
          loan.bondParams.collateralTokenAccount,
        ),
        userPubkey: wallet.publicKey,
      },
      args: {
        nextBoxIndex: '0',
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(...repayIxs, ...getCollateralIxs),
    signers: [repaySigners, getCollateralSigners].flat(),
  };
};
