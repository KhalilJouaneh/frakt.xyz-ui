import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useAuctionCard = () => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const onSubmit = () => {
    openLoadingModal();

    const params = {
      connection,
      wallet,
    };

    try {
      //? await({})
      closeConfirmModal();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  };
};
