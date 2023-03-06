import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { signAndConfirmTransaction } from './signAndConfirmTransaction';

interface TxnsAndSigners {
  transaction: web3.Transaction;
  signers?: web3.Signer[];
}

type SignTransactionsInSeries = (params: {
  transactionsAndSigners: TxnsAndSigners[];
  connection: web3.Connection;
  wallet: WalletContextState;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  onBeforeApprove?: () => void;
  setTransactionsLeft?: (value: number) => void;
}) => Promise<boolean>;

export const signAndSendTransactionsInSeries: SignTransactionsInSeries =
  async ({
    transactionsAndSigners,
    connection,
    wallet,
    onAfterSend,
    onSuccess,
    onError,
    setTransactionsLeft,
    onBeforeApprove,
  }) => {
    onBeforeApprove();

    for (let i = 0; i < transactionsAndSigners.length; ++i) {
      const { transaction, signers } = transactionsAndSigners[i];

      // setTransactionsLeft?.(transactionsAndSigners.length - i);

      try {
        await signAndConfirmTransaction({
          transaction,
          signers,
          connection,
          wallet,
          commitment: 'confirmed',
          onAfterSend,
          onBeforeApprove,
        });
        onSuccess?.();
      } catch (error) {
        onError?.();
      }
    }

    return true;
  };
