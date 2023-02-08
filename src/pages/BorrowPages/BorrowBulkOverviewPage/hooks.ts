import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { web3 } from 'fbonds-core';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { PATHS } from '@frakt/constants';
import { showSolscanLinkNotification } from '@frakt/utils/transactions';
import { makeCreateBondTransaction } from '@frakt/utils/bonds';
import { Order } from '@frakt/pages/BorrowPages/cartState';
import { Pair } from '@frakt/api/bonds';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { captureSentryError } from '@frakt/utils/sentry';
import { makeProposeTransaction } from '@frakt/utils/loans';
import { LoanType } from '@frakt/api/loans';
import { useConnection } from '@frakt/hooks';

import { useBorrow } from '../cartState';

export const useBorrowBulkOverviewPage = () => {
  const history = useHistory();
  const wallet = useWallet();
  const connection = useConnection();
  const { cartOrders, cartPairs, setCurrentNftFromOrder, clearCart } =
    useBorrow();

  //? Go to borrow root page if bulk selection doesn't exist
  useEffect(() => {
    if (history && !cartOrders.length) {
      history.replace(PATHS.BORROW_ROOT);
    }
  }, [history, cartOrders]);

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const onBorrow = async () => {
    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await borrowBulk({
        orders: cartOrders,
        pairs: cartPairs,
        wallet,
        connection,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      history.push(PATHS.BORROW_SUCCESS);
      clearCart();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs);
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const onBackBtnClick = () => history.goBack();

  const onBulkEdit = (mint?: string) => {
    if (mint) {
      setCurrentNftFromOrder(mint);
    } else {
      setCurrentNftFromOrder(cartOrders[0]?.borrowNft?.mint);
    }
    history.push(PATHS.BORROW_MANUAL);
  };

  return {
    cartOrders,
    onBackBtnClick,
    onBorrow,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onBulkEdit,
  };
};

type BorrowBulk = (props: {
  orders: Order[];
  pairs: Pair[];
  connection: web3.Connection;
  wallet: WalletContextState;
}) => Promise<boolean>;

const borrowBulk: BorrowBulk = async ({
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
            market: order.bondOrderParams?.market,
            pair: pairs.find(
              (pair) =>
                pair.publicKey ===
                order?.bondOrderParams?.orderParams?.[0]?.pairPubkey,
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
