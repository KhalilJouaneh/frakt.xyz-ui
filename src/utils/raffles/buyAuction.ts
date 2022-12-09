import raffle from '@frakters/raffle-sdk/lib/raffle-core/functions/user';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from './../index';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

type BuyAuction = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  nftMint: string;
  receiver: string;
  auction: string;
}) => Promise<boolean>;

export const buyAuction: BuyAuction = async ({
  connection,
  wallet,
  nftMint,
  receiver,
  auction,
}): Promise<boolean> => {
  try {
    await raffle.buyAuction({
      programId: new web3.PublicKey(''),
      connection,
      accounts: {
        auction: new web3.PublicKey(auction),
        user: wallet.publicKey,
        nftMint: new web3.PublicKey(nftMint),
        receiver: new web3.PublicKey(receiver),
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
      transactionName: 'buyAuction',
    });

    return false;
  }
};
