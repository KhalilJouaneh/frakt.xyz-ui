import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';

type DepositLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityPool: string;
  amount: number;
  onAfterSend?: () => void;
}) => Promise<boolean>;

export const depositLiquidity: DepositLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
  amount,
  onAfterSend,
}): Promise<boolean> => {
  try {
    const { ix } = await loans.depositLiquidity({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      liquidityPool: new web3.PublicKey(liquidityPool),
      user: wallet.publicKey,
      amount,
    });

    const transaction = new web3.Transaction().add(ix);

    await signAndConfirmTransaction({
      transaction,
      onAfterSend,
      connection,
      wallet,
    });

    notify({
      message: 'Deposit liquidity successfully!',
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
      transactionName: 'depositLiquidity',
      params: { liquidityPool, amount },
    });

    return false;
  }
};
