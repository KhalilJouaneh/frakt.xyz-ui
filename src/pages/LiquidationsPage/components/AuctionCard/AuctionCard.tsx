import { FC } from 'react';

import { AuctionListItem, WonRaffleListItem } from '@frakt/api/raffle';
import { LoadingModal } from '@frakt/components/LoadingModal';
import { ConfirmModal } from '@frakt/components/ConfirmModal';
import { createTimerJSX } from '@frakt/components/Timer';
import Button from '@frakt/components/Button';
import { Timer } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { useAuctionCard } from './useAuctionCard';
import styles from './AuctionCard.module.scss';

interface AuctionCardProps {
  auction: WonRaffleListItem | AuctionListItem;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction }) => {
  const {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  } = useAuctionCard();

  return (
    <>
      <div className={styles.card}>
        <GeneralCardInfo
          nftName={auction.nftName}
          nftImageUrl={auction.nftImageUrl}
          nftCollectionName={auction.nftCollectionName}
        />
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={auction.liquidationPrice}
          />
          <StatsRaffleValues
            label="liquidation price"
            value={auction.liquidationPrice}
          />
          <StatsRaffleValues label="Next round start">
            <div className={styles.wrapper}>
              <Timer />
              <div className={styles.countdown}>
                {createTimerJSX(auction.expiredAt)}
              </div>
            </div>
          </StatsRaffleValues>
          <StatsRaffleValues
            label="Next round price"
            value={auction.liquidationPrice}
          />
          <StatsRaffleValues
            label="Highest bit"
            value={auction.liquidationPrice}
          />
        </div>
        <Button
          type="secondary"
          className={styles.button}
          onClick={openConfirmModal}
        >
          Liquidate
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={onSubmit}
        title="Ready?"
        subtitle={'Confirm text'}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default AuctionCard;
