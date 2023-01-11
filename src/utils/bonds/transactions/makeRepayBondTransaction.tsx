import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { management } from 'fbonds-core/lib/fbond-protocol/functions/';
import { BONDS_ADMIN_PUBKEY, BONDS_PROGRAM_PUBKEY } from '../constants';

type MakeRepayBondTransaction = (params: {
  bondPubkey: string;
  bondTokenMint: string;
  bondCollateralOrSolReceiver: string;
  collateralTokenMint: string;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const makeRepayBondTransaction: MakeRepayBondTransaction = async ({
  bondPubkey,
  bondTokenMint,
  bondCollateralOrSolReceiver,
  collateralTokenMint,
  wallet,
  connection,
}) => {
  const { instructions: repayIxs, signers: repaySigners } =
    await management.repayFBond({
      accounts: {
        adminPubkey: BONDS_ADMIN_PUBKEY,
        fbond: new web3.PublicKey(bondPubkey),
        fbondsTokenMint: new web3.PublicKey(bondTokenMint),
        bondCollateralOrSolReceiver: new web3.PublicKey(
          bondCollateralOrSolReceiver,
        ),
        userPubkey: wallet.publicKey,
      },
      connection,
      programId: BONDS_PROGRAM_PUBKEY,
      sendTxn: sendTxnPlaceHolder,
    });

  const { instructions: getCollateralIxs, signers: getCollateralSigners } =
    await management.getRepaidCollateral({
      accounts: {
        collateralTokenMint: new web3.PublicKey(collateralTokenMint),
        fbond: new web3.PublicKey(bondPubkey),
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
