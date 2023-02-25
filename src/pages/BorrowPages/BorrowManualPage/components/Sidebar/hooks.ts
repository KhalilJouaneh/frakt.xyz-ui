import { useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { makeCreateBondTransaction } from '@frakt/utils/bonds';
import { useConnection } from '@frakt/hooks';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import { Market, Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { BorrowNft } from '@frakt/api/nft';

export const useSidebar = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    currentPair,
    market,
    currentLoanType,
    currentLoanValue,
    saveUpcomingOrderToCart,
    clearCart,
    clearCurrentNftState,
  } = useBorrow();

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);
  const goToToBorrowSuccessPage = () => {
    clearCart();
    clearCurrentNftState();
    history.push(PATHS.BORROW_SUCCESS);
  };

  const connection = useConnection();
  const wallet = useWallet();

  const onSubmit = async () => {
    if (isBulk) {
      saveUpcomingOrderToCart();
      return goToBulkOverviewPage();
    }

    try {
      const result = await borrowSingle({
        nft: currentNft,
        pair: currentPair,
        loanType: currentLoanType,
        loanValue: currentLoanValue,
        market,
        wallet,
        connection,
      });
      if (!result) {
        throw new Error('Error');
      }
      goToToBorrowSuccessPage();
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));
    }
  };

  return {
    isLoading: currentNft?.bondParams?.marketPubkey && isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
  };
};

type BorrowSingle = (props: {
  nft: BorrowNft;
  pair?: Pair;
  market?: Market;
  loanType: LoanType;
  loanValue: number;
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

const borrowSingle: BorrowSingle = async ({
  nft,
  pair,
  market,
  loanType,
  loanValue,
  connection,
  wallet,
}): Promise<boolean> => {
  try {
    const { transaction, signers } = await (() => {
      if (loanType === LoanType.BOND) {
        return makeCreateBondTransaction({
          nftMint: nft.mint,
          market,
          pair,
          borrowValue: loanValue,
          connection,
          wallet,
        });
      }

      return makeProposeTransaction({
        nftMint: nft.mint,
        valuation: nft.valuation,
        loanValue: loanValue,
        loanType: loanType,
        connection,
        wallet,
      });
    })();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet?.publicKey;
    if (signers.length) {
      transaction.sign(...signers);
    }

    const signedTransaction = await wallet?.signTransaction(transaction);

    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txid, blockhash, lastValidBlockHeight },
      'confirmed',
    ),
      notify({
        message: 'Borrowed successfully!',
        type: NotifyType.SUCCESS,
      });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error.logs?.join('\n'));
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
      transactionName: 'proposeSingleLoanWithBonds',
    });

    return false;
  }
};
