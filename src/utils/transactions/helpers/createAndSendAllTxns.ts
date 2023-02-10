import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';
import { chunk } from 'lodash';

import { mergeIxsIntoTxn } from './createTransactions';
import { NotifyType } from '../../solanaUtils';
import { notify } from '../..';

export interface IxnsData {
  instructions: web3.TransactionInstruction[] | web3.TransactionInstruction;
  signers: web3.Signer[];
}

interface CreateAndSendAllTxnsProps {
  transactions: IxnsData[];
  ixPerTxn?: number;
  connection: web3.Connection;
  wallet: WalletContextState;
  commitment?: web3.Commitment;
  onAfterSend?: () => void;
}

type CreateAndSendAllTxns = (props: CreateAndSendAllTxnsProps) => Promise<void>;

export const createAndSendAllTxns: CreateAndSendAllTxns = async ({
  transactions,
  ixPerTxn = 2,
  connection,
  wallet,
  onAfterSend,
  commitment = 'finalized',
}) => {
  const lookupTable = (
    await connection.getAddressLookupTable(
      new web3.PublicKey(process.env.LOOKUP_TABLE_PUBKEY),
    )
  ).value;

  if (!lookupTable) return;

  const ixsDataChunks = chunk(transactions, ixPerTxn);

  const txnData = ixsDataChunks.map((ixsAndSigners) =>
    mergeIxsIntoTxn(ixsAndSigners),
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash(commitment);

  const versionedTransactions = txnData.map(({ transaction, signers }) => {
    const transactionsMessageV0 = new web3.TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions: transaction.instructions,
    }).compileToV0Message([]);

    return {
      transaction: new web3.VersionedTransaction(transactionsMessageV0),
      signers,
    };
  });

  versionedTransactions.forEach(({ transaction, signers }) => {
    if (signers?.length) {
      transaction.sign([...signers]);
    }
  });

  const txns = versionedTransactions.map(({ transaction }) => transaction);

  onAfterSend?.();

  const signedTransactions = await wallet.signAllTransactions(txns);

  const txids = await Promise.all(
    signedTransactions.map((signedTransaction) =>
      connection.sendTransaction(signedTransaction, { maxRetries: 5 }),
    ),
  );

  notify({
    message: 'Transaction sent',
    // description: onSuccessMessage?.description,
    type: NotifyType.INFO,
  });

  await Promise.all(
    txids.map((txid) =>
      connection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight,
      }),
    ),
  );
};
