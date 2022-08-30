import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { captureSentryError } from '../sentry';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

type ClaimGemFarm = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  gemFarm: string;
  gemBank: string;
  farm: string;
  bank: string;
  nftMint: string;
  loan: string;
  isDegod: boolean;
  creatorWhitelistProof: string;
  rewardAMint: string;
  rewardBMint: string;
}) => Promise<boolean>;

export const claimGemFarm: ClaimGemFarm = async ({
  connection,
  wallet,
  gemFarm,
  gemBank,
  farm,
  bank,
  nftMint,
  loan,
  isDegod,
  rewardAMint,
  rewardBMint,
}): Promise<boolean> => {
  try {
    await loans.claimGemFarm({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      gemFarm: new web3.PublicKey(gemFarm),
      farm: new web3.PublicKey(farm),
      nftMint: new web3.PublicKey(nftMint),
      loan: new web3.PublicKey(loan),
      isDegod,
      rewardAMint: new web3.PublicKey(rewardAMint),
      rewardBMint: new web3.PublicKey(rewardBMint),
      sendTxn: async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          commitment: 'finalized',
        });
      },
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
      params: {
        gemFarm,
        gemBank,
        farm,
        bank,
        nftMint,
        loan,
        isDegod,
      },
    });

    return false;
  }
};
