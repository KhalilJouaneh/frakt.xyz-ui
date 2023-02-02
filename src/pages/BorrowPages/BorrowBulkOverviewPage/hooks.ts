import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import { useWallet } from '@solana/wallet-adapter-react';

import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModal } from '@frakt/components/LoadingModal';
// import { proposeBulkLoan } from '@frakt/utils/loans';
// import { useConnection } from '@frakt/hooks';
import { PATHS } from '@frakt/constants';

import { useCart } from '../cartState';

export const useBorrowBulkOverviewPage = () => {
  const history = useHistory();
  // const wallet = useWallet();
  // const connection = useConnection();
  const { orders } = useCart();

  //? Go to borrow root page if bulk selection doesn't exist
  useEffect(() => {
    if (history && !orders.length) {
      history.replace(PATHS.BORROW_ROOT);
    }
  }, [history, orders]);

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

      await new Promise((res) => res);

      // const result = await proposeBulkLoan({
      //   wallet,
      //   connection,
      //   selectedBulk: selection,
      // });

      // if (!result) {
      //   throw new Error('Loan proposing failed');
      // }

      // history.push(PATHS.BORROW_SUCCESS);
      // clearSelection();
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
    // if (mint) {
    //   setHighlightedNftMint(mint);
    // }
    mint;
    history.push(PATHS.BORROW_MANUAL);
  };

  return {
    selection: orders,
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
