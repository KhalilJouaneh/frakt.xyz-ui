import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';

type HarvestLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityPool: string;
}) => Promise<boolean>;

export const harvestLiquidity: HarvestLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
}): Promise<boolean> => {
  try {
    const { ix } = await loans.harvestLiquidity({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      adminPubkey: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
      connection,
      liquidityPool: new web3.PublicKey(liquidityPool),
      user: wallet.publicKey,
    });

    const transaction = new web3.Transaction().add(ix);

    await signAndConfirmTransaction({
      transaction,
      connection,
      wallet,
    });

    notify({
      message: 'Harvest liquidity successfully!',
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
      transactionName: 'harvestLiquidity',
      params: { liquidityPool },
    });

    return false;
  }
};
