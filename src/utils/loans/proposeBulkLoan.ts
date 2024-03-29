import { chunk } from 'lodash';
import { web3, loans, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify, SOL_TOKEN } from '../';
import { captureSentryError } from '../sentry';
import {
  mergeIxsIntoTxn,
  showSolscanLinkNotification,
  IxnsData,
} from '../transactions';

type ProposeLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  selectedBulk: any[];
}) => Promise<boolean>;

const IX_PER_TXN = 1;

export const proposeBulkLoan: ProposeLoan = async ({
  connection,
  wallet,
  selectedBulk,
}): Promise<boolean> => {
  const transactions = [] as IxnsData[];

  try {
    for (let index = 0; index < selectedBulk.length; index++) {
      const { mint, valuation, isPriceBased, priceBased, solLoanValue } =
        selectedBulk[index];

      const valuationNumber = parseFloat(valuation);

      const suggestedLoanValue = priceBased?.suggestedLoanValue;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;

      const rawLoanToValue = (solLoanValue / valuationNumber) * 100;

      const proposedNftPrice = valuationNumber * 10 ** SOL_TOKEN.decimals;

      const loanToValue = rawLoanToValue || suggestedLtvPersent;

      const { ixs, loan } = await loans.proposeLoanIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        nftMint: new web3.PublicKey(mint),
        proposedNftPrice: new BN(proposedNftPrice),
        isPriceBased,
        loanToValue: new BN(loanToValue * 100),
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
      });

      transactions.push({ instructions: ixs, signers: [loan] });
    }

    const ixsDataChunks = chunk(transactions, IX_PER_TXN);

    const txnData = ixsDataChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    txnData.forEach(({ transaction }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    const txn = txnData.map(({ transaction, signers }) => {
      if (signers) {
        transaction.sign(...signers);
      }
      return transaction;
    });

    const signedTransactions = await wallet.signAllTransactions(txn);

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
      message:
        'We are collateralizing your jpegs. It should take less than a minute',
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
      transactionName: 'proposeBulkLoan',
    });

    return false;
  }
};
