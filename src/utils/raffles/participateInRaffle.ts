import raffle from '@frakters/raffle-sdk/lib/raffle-core/functions/user';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { BN, web3 } from '@frakt-protocol/frakt-sdk';

import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from './../index';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

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
    await raffle.participateInRaffle({
      programId: new web3.PublicKey(''),
      connection,
      args: { tickets: new BN(tickets) },
      accounts: {
        raffle: new web3.PublicKey(raffleAddress),
        user: wallet.publicKey,
      },
      sendTxn: async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          commitment: 'finalized',
        });
      },
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
