import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { signAndConfirmTransaction } from '../../utils/transactions';

export interface IxnsData {
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}

interface TxnDataWithHandlers {
  transaction: web3.Transaction;
  signers: web3.Signer[];
}

interface TxnData {
  transaction: web3.Transaction;
  signers: web3.Signer[];
}

type SignTransactionsInSeries = (params: {
  txnData: TxnDataWithHandlers[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const mergeIxsIntoTxn = (ixs: IxnsData[]): TxnData => {
  const transaction = new web3.Transaction();

  transaction.add(...ixs.map(({ instructions }) => instructions).flat());

  const signers = ixs.map(({ signers }) => signers).flat();

  return {
    transaction,
    signers,
  };
};

export const signAndSendTransactionsInSeries: SignTransactionsInSeries =
  async ({ txnData, connection, wallet }) => {
    for (let i = 0; i < txnData.length; ++i) {
      const { transaction, signers } = txnData[i];
      try {
        await signAndConfirmTransaction({
          transaction,
          signers,
          connection,
          wallet,
          commitment: 'confirmed',
        });
      } catch (error) {
        console.error(error);
        error?.logs && console.error('Error logs: \n', error.logs?.join('\n'));

        return false;
      }
    }

    return true;
  };
