import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { buyAuction, buyAuctionBond } from '@frakt/utils/raffles';
import { useLoadingModal } from '@frakt/components/LoadingModal';
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

  const onSubmit = async (): Promise<void> => {
    openLoadingModal();
    try {
      if (!auction?.bondPubKey) {
        const result = await buyAuction({
          connection,
          wallet,
          nftMint: auction?.nftMint,
          raffleAddress: auction.auctionPubkey,
        });

        if (result) {
          hideAuction(auction.auctionPubkey);
        }
      } else {
        const result = await buyAuctionBond({
          connection,
          wallet,
          nftMint: auction?.nftMint,
          raffleAddress: auction.auctionPubkey,
          fbond: auction.bondPubKey,
        });

        if (result) {
          hideAuction(auction.auctionPubkey);
        }
      }
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
  };
};
