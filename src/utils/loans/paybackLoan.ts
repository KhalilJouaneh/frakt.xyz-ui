import { web3, BN, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { createAndSendTxn, showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { Loan } from '../../state/loans/types';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';

type PaybackLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loan: Loan;
  paybackAmount?: BN;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
  paybackAmount,
}): Promise<boolean> => {
  try {
    if (loan.isGracePeriod) {
      const { ixs } = await loans.paybackLoanWithGraceIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        liquidationLot: new web3.PublicKey(loan.liquidationLot),
        loan: new web3.PublicKey(loan.pubkey),
        nftMint: new web3.PublicKey(loan.mint),
        liquidityPool: new web3.PublicKey(loan.liquidityPool),
        collectionInfo: new web3.PublicKey(loan.collectionInfo),
        royaltyAddress: new web3.PublicKey(loan.royaltyAddress),
      });

      await createAndSendTxn({
        txInstructions: ixs,
        connection,
        wallet,
      });
    } else {
      const { ixs } = await loans.paybackLoanIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        loan: new web3.PublicKey(loan.pubkey),
        nftMint: new web3.PublicKey(loan.mint),
        liquidityPool: new web3.PublicKey(loan.liquidityPool),
        collectionInfo: new web3.PublicKey(loan.collectionInfo),
        royaltyAddress: new web3.PublicKey(loan.royaltyAddress),
        paybackAmount,
      });

      await createAndSendTxn({
        txInstructions: ixs,
        connection,
        wallet,
      });
    }

    notify({
      message: 'Paid back successfully!',
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
      transactionName: 'paybackLoan',
      params: { loan },
    });

    return false;
  }
};
