import { web3, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { Loan, LoanType } from '@frakt/api/loans';

import { captureSentryError } from '../sentry';
import { notify } from '../';
import { NotifyType } from '../solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';
import { makeRepayBondTransaction } from '../bonds';
import { makePaybackLoanTransaction } from './makePaybackLoanTransaction';

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
    const { transaction, signers } = await (async () => {
      if (loan.loanType === LoanType.BOND) {
        return await makeRepayBondTransaction({
          loan,
          wallet,
          connection,
        });
      } else {
        return await makePaybackLoanTransaction({
          loan,
          paybackAmount,
          wallet,
          connection,
        });
      }
    })();

    await signAndConfirmTransaction({
      transaction,
      signers,
      connection,
      wallet,
      commitment: 'confirmed',
    });

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
