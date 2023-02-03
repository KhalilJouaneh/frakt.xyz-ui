import { useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useHistory } from 'react-router-dom';

import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { makeCreateBondTransaction } from '@frakt/utils/bonds';
import { useConnection } from '@frakt/hooks';
import { useCart, Order } from '@frakt/pages/BorrowPages/cartState';
import { Pair } from '@frakt/api/bonds';
import { web3 } from 'fbonds-core';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { useCartState } from '@frakt/pages/BorrowPages/cartState/cartState';

export const useSidebar = () => {
  const {
    orders,
    onNextOrderSelect: onNextOrder,
    onRemoveOrder,
    isLoading,
    currentOrder: order,
    totalBorrowValue,
  } = useCart();

  const { pairs: cartPairs } = useCartState();

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);
  const goToToBorrowSuccessPage = () => history.push(PATHS.BORROW_SUCCESS);

  const isBulk = orders.length > 1;

  const loading = order?.borrowNft?.bondParams && isLoading;

  const connection = useConnection();
  const wallet = useWallet();

  const onSubmit = async () => {
    try {
      const result = await borrow({
        orders,
        pairs: cartPairs,
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
    order,
    minimizedOnMobile,
    setMinimizedOnMobile,
    isBulk,
    loading,
    onRemoveOrder,
    onNextOrder,
    goToBulkOverviewPage,
    totalBorrowValue,
    onSubmit,
  };
};

type Borrow = (props: {
  orders: Order[];
  pairs: Pair[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

export const borrow: Borrow = async ({
  orders,
  pairs,
  connection,
  wallet,
}): Promise<boolean> => {
  try {
    const transactionsAndSigners = await Promise.all(
      orders.map((order) => {
        if (order.loanType === LoanType.BOND) {
          return makeCreateBondTransaction({
            nftMint: order.borrowNft.mint,
            market: order.bondParams.market,
            pair: pairs.find(
              (pair) => pair.publicKey === order.bondParams.pairPubkey,
            ),
            borrowValue: order.loanValue,
            connection,
            wallet,
          });
        }

        return makeProposeTransaction({
          nftMint: order.borrowNft.mint,
          valuation: order.borrowNft.valuation,
          loanValue: order.loanValue,
          loanType: order.loanType,
          connection,
          wallet,
        });
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
      message: 'Borrowed successfully!',
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
      transactionName: 'proposeBulkLoanWithBonds',
    });

    return false;
  }
};
