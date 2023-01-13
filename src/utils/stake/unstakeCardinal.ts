import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify } from '..';
import { captureSentryError } from '../sentry';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type UnstakeCardinal = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  nftMint: string;
  loan: string;
}) => Promise<boolean>;

export const unstakeCardinal: UnstakeCardinal = async ({
  connection,
  wallet,
  nftMint,
  loan,
}): Promise<boolean> => {
  try {
    const { unstakeIx, additionalComputeBudgetInstructionIx } =
      await loans.unstakeCardinalIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        payer: wallet.publicKey,
        cardinalRewardsCenter: new web3.PublicKey(process.env.STAKE_PROGRAM_ID),
        nftMint: new web3.PublicKey(nftMint),
        stakePool: new web3.PublicKey(process.env.STAKE_POOL),
        loan: new web3.PublicKey(loan),
        unstakeRewardsPaymentInfo: new web3.PublicKey(
          process.env.UNSTAKE_REWARDS_PAYMENT_INFO,
        ),
        rewardMint: new web3.PublicKey(process.env.STAKE_REWARD_MINT),
        paymentPubkey1: new web3.PublicKey(process.env.STAKE_PAYMENT_1),
        paymentPubkey2: new web3.PublicKey(process.env.STAKE_PAYMENT_2),
      });

    const transaction = new web3.Transaction()
      .add(unstakeIx)
      .add(additionalComputeBudgetInstructionIx);

    await signAndConfirmTransaction({
      connection,
      wallet,
      transaction,
    });

    notify({
      message: 'Unstake successfully!',
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
      transactionName: 'unstakeCardinal',
      params: { nftMint, loan },
    });

    return false;
  }
};
