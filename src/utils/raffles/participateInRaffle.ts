import { participateInRaffle as txn } from '@frakters/raffle-sdk/lib/raffle-core/functions/user';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { BN, web3 } from '@frakt-protocol/frakt-sdk';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from './../index';

type ParticipateInRaffle = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  tickets: number;
  raffleAddress: string;
}) => Promise<boolean>;

export const participateInRaffle: ParticipateInRaffle = async ({
  connection,
  wallet,
  tickets,
  raffleAddress,
}): Promise<boolean> => {
  try {
    const { ix } = await txn({
      programId: new web3.PublicKey(process.env.RAFFLE_PROGRAM_PUBKEY),
      connection,
      args: { tickets: new BN(tickets) },
      accounts: {
        raffle: new web3.PublicKey(raffleAddress),
        user: wallet.publicKey,
      },
    });

    const transaction = new web3.Transaction().add(ix);

    await signAndConfirmTransaction({
      transaction,
      connection,
      wallet,
    });

    notify({
      message: 'Transaction successful!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'participateInRaffle',
    });

    return false;
  }
};
