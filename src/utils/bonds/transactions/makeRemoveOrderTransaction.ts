import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { virtual as pairs } from 'fbonds-core/lib/fbond-protocol/functions/market-factory/pair';
import { BONDS_PROGRAM_PUBKEY } from '../constants';

type MakeRemoveOrderTransaction = (params: {
  pairPubkey: web3.PublicKey;
  authorityAdapter: web3.PublicKey;
  edgeSettlement: number; //? Raw value
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const makeRemoveOrderTransaction: MakeRemoveOrderTransaction = async ({
  pairPubkey,
  authorityAdapter,
  edgeSettlement,
  connection,
  wallet,
}) => {
  const { instructions: instructions1, signers: signers1 } =
    await pairs.withdrawals.withdrawSolFromPair({
      accounts: {
        authorityAdapter,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      args: {
        amountOfTokensToWithdraw: edgeSettlement,
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  const { instructions: instructions2, signers: signers2 } =
    await pairs.mutations.closeVirtualPair({
      accounts: {
        authorityAdapter,
        pair: pairPubkey,
        userPubkey: wallet.publicKey,
      },
      programId: BONDS_PROGRAM_PUBKEY,
      connection,
      sendTxn: sendTxnPlaceHolder,
    });

  return {
    transaction: new web3.Transaction().add(
      ...[instructions1, instructions2].flat(),
    ),
    signers: [...signers1, ...signers2],
  };
};
