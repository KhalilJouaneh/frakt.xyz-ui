import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';
import { FEE_ACCOUNT_PUBKEY } from './constants';

type StakeGemFarm = (props: {
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
}) => Promise<boolean>;

export const stakeGemFarm: StakeGemFarm = async ({
  connection,
  wallet,
  gemFarm,
  gemBank,
  farm,
  bank,
  nftMint,
  loan,
  isDegod,
  creatorWhitelistProof,
}): Promise<boolean> => {
  try {
    await loans.stakeGemFarm({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      gemFarm: new web3.PublicKey(gemFarm),
      gemBank: new web3.PublicKey(gemBank),
      farm: new web3.PublicKey(farm),
      bank: new web3.PublicKey(bank),
      feeAcc: new web3.PublicKey(FEE_ACCOUNT_PUBKEY),
      nftMint: new web3.PublicKey(nftMint),
      loan: new web3.PublicKey(loan),
      isDegod,
      creatorWhitelistProof: new web3.PublicKey(creatorWhitelistProof),
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
      message: 'Stake successfully!',
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
      transactionName: 'stakeGemFarm',
      params: {
        gemFarm,
        gemBank,
        farm,
        bank,
        nftMint,
        loan,
        isDegod,
        creatorWhitelistProof,
      },
    });

    return false;
  }
};
