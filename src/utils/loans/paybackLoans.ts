import { web3, loans as loansService, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { chunk } from 'lodash';

import { mergeIxsIntoTxn } from '../../pages/BorrowPage/helpers';
import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { Loan } from '@frakt/state/loans/types';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';

type PaybackLoans = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loans: Loan[];
  paybackAmount?: BN;
}) => Promise<boolean>;

const IX_PER_TXN = 3;

export const paybackLoans: PaybackLoans = async ({
  connection,
  wallet,
  loans,
  paybackAmount,
}): Promise<boolean> => {
  const transactions = [];

  try {
    for (let index = 0; index < loans.length; index++) {
      const {
        mint,
        pubkey,
        isGracePeriod,
        liquidityPool,
        collectionInfo,
        royaltyAddress,
        liquidationLot,
      } = loans[index];

      if (isGracePeriod) {
        const { ixs } = await loansService.paybackLoanWithGraceIx({
          programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
          connection,
          user: wallet.publicKey,
          admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
          liquidationLot: new web3.PublicKey(liquidationLot),
          loan: new web3.PublicKey(pubkey),
          nftMint: new web3.PublicKey(mint),
          liquidityPool: new web3.PublicKey(liquidityPool),
          collectionInfo: new web3.PublicKey(collectionInfo),
          royaltyAddress: new web3.PublicKey(royaltyAddress),
        });

        transactions.push({ instructions: ixs });
      } else {
        const { paybackLoanIx } = await loansService.paybackLoanIx({
          programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
          connection,
          user: wallet?.publicKey,
          admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
          loan: new web3.PublicKey(pubkey),
          nftMint: new web3.PublicKey(mint),
          liquidityPool: new web3.PublicKey(liquidityPool),
          collectionInfo: new web3.PublicKey(collectionInfo),
          royaltyAddress: new web3.PublicKey(royaltyAddress),
          paybackAmount,
        });

        transactions.push({ instructions: paybackLoanIx });
      }
    }

    const ixsDataChunks = chunk(transactions, IX_PER_TXN);

    const txnData = ixsDataChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    txnData.forEach(({ transaction }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet?.publicKey;
    });

    const txn = await txnData.map(({ transaction, signers }) => {
      if (signers[0]) {
        transaction.sign(...signers);
      }
      return transaction;
    });

    const signedTransactions = await wallet?.signAllTransactions(txn);

    const txids = await Promise.all(
      signedTransactions.map((signedTransaction) =>
        connection.sendRawTransaction(signedTransaction.serialize()),
      ),
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await Promise.all(
      txids.map((txid) =>
        connection.confirmTransaction(
          { signature: txid, blockhash, lastValidBlockHeight },
          'confirmed',
        ),
      ),
    );

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
      transactionName: 'paybackLoans',
    });

    return false;
  }
};
