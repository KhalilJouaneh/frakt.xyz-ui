import {
  CollectionInfoView,
  LoanView,
  paybackLoan as txn,
} from '@frakters/nft-lending-v2';
import { Provider } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

import { notify } from '../../../utils';
import { NotifyType } from '../../../utils/solanaUtils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';

type PaybackLoan = (props: {
  connection: Connection;
  wallet: WalletContextState;
  loan: LoanView;
  collectionInfo: CollectionInfoView;
}) => Promise<boolean>;

export const paybackLoan: PaybackLoan = async ({
  connection,
  wallet,
  loan,
  collectionInfo,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      user: wallet.publicKey,
      admin: new PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      loan: new PublicKey(loan.loanPubkey),
      nftMint: new PublicKey(loan.nftMint),
      liquidityPool: new PublicKey(loan.liquidityPool),
      collectionInfo: new PublicKey(loan.collectionInfo),
      royalty_address: new PublicKey(collectionInfo.royaltyAddress),
      amountToReturn: loan.amountToReturn,
      sendTxn: async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
        });
      },
    });

    notify({
      message: 'Payback made successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Payback failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
