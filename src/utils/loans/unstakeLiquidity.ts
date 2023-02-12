import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';

type UnstakeLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityPool: string;
  amount: number;
  onAfterSend?: () => void;
}) => Promise<boolean>;

export const unstakeLiquidity: UnstakeLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
  amount,
  onAfterSend,
}): Promise<boolean> => {
  try {
    const { ix } = await loans.unstakeLiquidity({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      adminPubkey: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
      connection,
      liquidityPool: new web3.PublicKey(liquidityPool),
      user: wallet.publicKey,
      amount,
    });

    const transaction = new web3.Transaction().add(ix);

    await signAndConfirmTransaction({
      onAfterSend,
      transaction,
      connection,
      wallet,
      commitment: 'confirmed',
    });

    notify({
      message: 'Unstake liquidity successfully!',
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
      transactionName: 'unstakeLiquidity',
      params: { liquidityPool, amount },
    });

    return false;
  }
};
