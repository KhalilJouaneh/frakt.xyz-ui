import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Bond } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { captureSentryError } from '@frakt/utils/sentry';

import { makeRedeemBondTransaction } from './makeRedeemBondTransaction';

type RedeemBond = (props: {
  bond: Bond;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const redeemBond: RedeemBond = async ({
  bond,
  connection,
  wallet,
}): Promise<boolean> => {
  try {
    const { transaction, signers } = await makeRedeemBondTransaction({
      bond,
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
      message: 'Redeemed successfully!',
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
      transactionName: 'claimRewardBonds',
    });

    return false;
  }
};
