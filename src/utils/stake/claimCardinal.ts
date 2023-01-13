import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '..';

type ClaimCardinal = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  nftMint: string;
  loan: string;
}) => Promise<boolean>;

export const claimCardinal: ClaimCardinal = async ({
  connection,
  wallet,
  nftMint,
  loan,
}): Promise<boolean> => {
  try {
    await loans.claimCardinalIx({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      payer: wallet.publicKey,
      user: wallet.publicKey,
      cardinalRewardsCenter: new web3.PublicKey(process.env.STAKE_PROGRAM_ID),
      nftMint: new web3.PublicKey(nftMint),
      rewardDistributor: new web3.PublicKey(
        process.env.STAKE_REWARD_DISTRIBUTOR,
      ),
      stakePool: new web3.PublicKey(process.env.STAKE_POOL),
      loan: new web3.PublicKey(loan),
      claimRewardsPaymentInfo: new web3.PublicKey(
        process.env.CLAIM_REWARDS_PAYMENT_INFO,
      ),
      rewardMint: new web3.PublicKey(process.env.STAKE_REWARD_MINT),
      paymentPubkey1: new web3.PublicKey(process.env.STAKE_PAYMENT_1),
      paymentPubkey2: new web3.PublicKey(process.env.STAKE_PAYMENT_2),
    });

    notify({
      message: 'Claimed successfully!',
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
      transactionName: 'claimGemFarm',
      params: { nftMint, loan },
    });

    return false;
  }
};
