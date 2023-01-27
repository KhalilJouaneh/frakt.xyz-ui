import { Bond } from '@frakt/api/bonds';
import { sendTxnPlaceHolder } from '@frakt/utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import { management } from 'fbonds-core/lib/fbond-protocol/functions/';
import { BONDS_PROGRAM_PUBKEY } from '../constants';

type MakeRedeemBondTransaction = (params: {
  bond: Bond;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<{
  transaction: web3.Transaction;
  signers: web3.Signer[];
}>;

export const makeRedeemBondTransaction: MakeRedeemBondTransaction = async ({
  bond,
  wallet,
  connection,
}) => {
  const { instructions, signers } = await management.redeemFBonds({
    accounts: {
      fbond: new web3.PublicKey(bond.fbond.publicKey),
      fbondsTokenMint: new web3.PublicKey(bond.fbond.fbondTokenMint),
      userPubkey: wallet.publicKey,
    },
    connection,
    programId: BONDS_PROGRAM_PUBKEY,
    sendTxn: sendTxnPlaceHolder,
  });

  return {
    transaction: new web3.Transaction().add(...instructions),
    signers,
  };
};
