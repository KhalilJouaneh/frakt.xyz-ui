import { FC } from 'react';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { createTimerJSX } from '@frakt/components/Timer';
import { GraceListItem } from '@frakt/api/raffle';
import styles from './GraceCard.module.scss';
import { Timer } from '@frakt/icons';

interface GraceCardProps {
  raffle: GraceListItem;
}

const GraceCard: FC<GraceCardProps> = ({ raffle }) => {
  return (
    <div className={styles.card}>
      <GeneralCardInfo
        nftName={raffle.nftName}
        nftImageUrl={raffle.nftImageUrl}
        nftCollectionName={raffle.nftCollectionName}
      />
      <div className={styles.statsValue}>
        <StatsRaffleValues
          className={styles.opacity}
          label="Floor price"
          value={raffle.valuation}
        />
        <StatsRaffleValues
          label="liquidation price"
          value={raffle.liquidationPrice}
        />
        <StatsRaffleValues label="Grace period">
          <div className={styles.wrapper}>
            <Timer />
            <div className={styles.countdown}>
              {createTimerJSX(raffle.expiredAt)}
            </div>
          </div>
        </StatsRaffleValues>
      </div>
    </div>
  );
};

export default GraceCard;
