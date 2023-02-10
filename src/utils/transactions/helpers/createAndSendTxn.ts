import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { notify } from '../..';
import { NotifyType } from '../../solanaUtils';

interface CreateAndSendTransactionProps {
  txInstructions: web3.TransactionInstruction[];
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onAfterSend?: () => void;
  additionalSigners?: web3.Signer[];
}

type CreateAndSendTxn = (props: CreateAndSendTransactionProps) => Promise<void>;

export const createAndSendTxn: CreateAndSendTxn = async ({
  txInstructions,
  connection,
  wallet,
  onAfterSend,
  additionalSigners = [],
  commitment = 'finalized',
}) => {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);

  const lookupTable = (
    await connection.getAddressLookupTable(
      new web3.PublicKey(process.env.LOOKUP_TABLE_PUBKEY),
    )
  ).value;

  if (!lookupTable) return;

  const messageV0 = new web3.TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToV0Message([lookupTable]);

  const transaction = new web3.VersionedTransaction(messageV0);

  const signedTransaction = await wallet.signTransaction(transaction);
  signedTransaction.sign([...additionalSigners]);

  onAfterSend?.();

  const txid = await connection.sendTransaction(transaction, { maxRetries: 5 });

  notify({
    message: 'Transaction sent',
    // description: onSuccessMessage?.description,
    type: NotifyType.INFO,
  });

  await connection.confirmTransaction({
    signature: txid,
    blockhash,
    lastValidBlockHeight,
  });
};
