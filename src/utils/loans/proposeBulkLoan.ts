import { web3, loans, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { captureSentryError } from '../sentry';
import { NotifyType } from '../solanaUtils';
import { notify, SOL_TOKEN } from '../';
import {
  IxnsData,
  showSolscanLinkNotification,
  createAndSendAllTxns,
} from '../transactions/helpers';

type ProposeLoan = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  selectedBulk: any[];
}) => Promise<boolean>;

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

      const { ix, loan } = await loans.proposeLoanIx({
        programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        nftMint: new web3.PublicKey(mint),
        proposedNftPrice: new BN(proposedNftPrice),
        isPriceBased,
        loanToValue: new BN(loanToValue * 100),
        admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        nameForRuleSet: process.env.NAME_FOR_RULE_SET,
        payerRuleSet: new web3.PublicKey(process.env.PAYER_RULE_SET),
      });

      transactions.push({ instructions: ix, signers: [loan] });
    }
    await createAndSendAllTxns({
      commitment: 'confirmed',
      transactions,
      connection,
      wallet,
    });

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
