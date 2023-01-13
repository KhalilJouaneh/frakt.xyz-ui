import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '..';

type StakeCardinal = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  nftMint: string;
  loan: string;
}) => Promise<boolean>;

export const stakeCardinal: StakeCardinal = async ({
  connection,
  wallet,
  nftMint,
  loan,
}): Promise<boolean> => {
  try {
    await loans.stakeCardinalIx({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      payer: wallet.publicKey,
      cardinalRewardsCenter: new web3.PublicKey(process.env.STAKE_PROGRAM_ID),
      nftMint: new web3.PublicKey(nftMint),
      stakePool: new web3.PublicKey(process.env.STAKE_POOL),
      loan: new web3.PublicKey(loan),
      stakeRewardsPaymentInfo: new web3.PublicKey(
        process.env.STAKE_REWARDS_PAYMENT_INFO,
      ),
      rewardMint: new web3.PublicKey(process.env.STAKE_REWARD_MINT),
      paymentPubkey1: new web3.PublicKey(process.env.STAKE_PAYMENT_1),
      paymentPubkey2: new web3.PublicKey(process.env.STAKE_PAYMENT_2),
    });

    notify({
      message: 'Staked successfully!',
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
      transactionName: 'stakeCardinal',
      params: { nftMint, loan },
    });

    return false;
  }
};
