import { web3 } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan, LoanType } from '@frakt/api/loans';

import { showSolscanLinkNotification } from '../transactions';
import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { makeRepayBondTransaction } from '../bonds';
import { makePaybackLoanTransaction } from './makePaybackLoanTransaction';

type PaybackLoans = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  loans: Loan[];
}) => Promise<boolean>;

export const paybackLoans: PaybackLoans = async ({
  connection,
  wallet,
  loans,
}): Promise<boolean> => {
  try {
    const transactionsAndSigners = await Promise.all(
      loans.map(async (loan) => {
        if (loan.loanType === LoanType.BOND) {
          return await makeRepayBondTransaction({
            loan,
            wallet,
            connection,
          });
        } else {
          return await makePaybackLoanTransaction({
            loan,
            wallet,
            connection,
          });
        }
      }),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactions = transactionsAndSigners.map(
      ({ transaction, signers }) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet?.publicKey;
        if (signers.length) {
          transaction.sign(...signers);
        }

        return transaction;
      },
    );

    const signedTransactions = await wallet?.signAllTransactions(transactions);

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
