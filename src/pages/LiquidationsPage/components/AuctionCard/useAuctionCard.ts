import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { buyAuction, buyAuctionBond } from '@frakt/utils/raffles';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { AuctionListItem } from '@frakt/api/raffle';

export const useAuctionCard = (
  auction: AuctionListItem,
  hideAuction: (value: string) => void,
) => {
  const wallet = useWallet();
  const { connection } = useConnection();

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

  const onSubmit = async (): Promise<void> => {
    openLoadingModal();

    try {
      // if (!auction.fbond) {
      const result = await buyAuction({
        connection,
        wallet,
        nftMint: auction?.nftMint,
        raffleAddress: auction.auctionPubkey,
      });

      if (result) {
        hideAuction(auction.auctionPubkey);
      }
      // } else {
      //   await buyAuctionBond({
      //     connection,
      //     wallet,
      //     nftMint: auction?.nftMint,
      //     raffleAddress: auction.auctionPubkey,
      //     fbond: '',
      //   });
      // }

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
