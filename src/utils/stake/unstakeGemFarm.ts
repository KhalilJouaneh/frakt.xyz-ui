import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { captureSentryError } from '../sentry';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { DEGODS_FARM_PUBKEY, FEE_ACCOUNT_PUBKEY } from './constants';
import { Loan } from '../../state/loans/types';

type UnstakeGemFarm = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  gemFarm: string;
  gemBank: string;
  loan: Loan;
  isDegod: boolean;
}) => Promise<boolean>;

export const unstakeGemFarm: UnstakeGemFarm = async ({
  connection,
  wallet,
  gemFarm,
  gemBank,
  loan,
  isDegod,
}): Promise<boolean> => {
  const transaction = new web3.Transaction();

  const { reward } = loan;

  try {
    const claimInstruction = await loans.claimGemFarmIx({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      gemFarm: new web3.PublicKey(DEGODS_FARM_PUBKEY),
      farm: new web3.PublicKey(reward?.farm),
      nftMint: new web3.PublicKey(loan?.mint),
      loan: new web3.PublicKey(loan?.pubkey),
      isDegod: true,
      rewardAMint: new web3.PublicKey(reward?.rewardAMint),
      rewardBMint: new web3.PublicKey(reward?.rewardBMint),
    });

    if (reward?.amount) {
      transaction.add(...claimInstruction);
    }

    const unstakeInstruction = await loans.unstakeGemFarmIx({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
      user: wallet.publicKey,
      gemFarm: new web3.PublicKey(gemFarm),
      gemBank: new web3.PublicKey(gemBank),
      farm: new web3.PublicKey(reward.farm),
      bank: new web3.PublicKey(reward.bank),
      feeAcc: new web3.PublicKey(FEE_ACCOUNT_PUBKEY),
      nftMint: new web3.PublicKey(loan.mint),
      loan: new web3.PublicKey(loan.pubkey),
      isDegod,
    });

    transaction.add(...unstakeInstruction);

    await signAndConfirmTransaction({
      transaction,
      connection,
      wallet,
    });

    notify({
      message: 'Unstaked successfully!',
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
      transactionName: 'unstakeGemFarm',
      params: {
        gemFarm,
        gemBank,
        loan,
        isDegod,
      },
    });

    return false;
  }
};
