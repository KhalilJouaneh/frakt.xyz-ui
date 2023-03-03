import { buyAuction as txn } from '@frakters/raffle-sdk/lib/raffle-core/functions/user';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { web3 } from '@frakt-protocol/frakt-sdk';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from './../index';

type BuyAuction = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  raffleAddress: string;
  nftMint: string;
}) => Promise<boolean>;

export const buyAuction: BuyAuction = async ({
  connection,
  wallet,
  raffleAddress,
  nftMint,
}): Promise<boolean> => {
  try {
    const { ixs } = await txn({
      programId: new web3.PublicKey(process.env.RAFFLE_PROGRAM_PUBKEY),
      connection,
      accounts: {
        auction: new web3.PublicKey(raffleAddress),
        user: wallet.publicKey,
        nftMint: new web3.PublicKey(nftMint),
        receiver: new web3.PublicKey(''),
      },
    });

    const transaction = new web3.Transaction().add(...ixs);

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
