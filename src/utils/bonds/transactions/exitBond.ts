import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Bond, Market, Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';

import { makeExitBondTransaction } from './makeExitBondTransaction';

type ExitBond = (props: {
  bond: Bond;
  market: Market;
  pair: Pair;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const exitBond: ExitBond = async ({
  bond,
  market,
  pair,
  connection,
  wallet,
}): Promise<boolean> => {
  try {
    const { transaction, signers } = await makeExitBondTransaction({
      bond,
      market,
      pair,
      connection,
      wallet,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet?.publicKey;

    if (signers.length) {
      transaction.sign(...signers);
    }

    const signedTransaction = await wallet?.signTransaction(transaction);

    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txid, blockhash, lastValidBlockHeight },
      'confirmed',
    );

    notify({
      message: 'Exit successfull!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'exitBond',
    });

    return false;
  }
};
