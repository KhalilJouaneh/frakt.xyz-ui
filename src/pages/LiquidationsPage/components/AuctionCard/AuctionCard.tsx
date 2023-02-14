import { FC } from 'react';

import { AuctionListItem, WonRaffleListItem } from '@frakt/api/raffle';
import { createTimerJSX } from '@frakt/components/Timer';
import { Timer } from '@frakt/icons';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import styles from './AuctionCard.module.scss';

interface AuctionCardProps {
  auction: WonRaffleListItem | AuctionListItem;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction }) => {
  return (
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
    </div>
  );
};

export default AuctionCard;
