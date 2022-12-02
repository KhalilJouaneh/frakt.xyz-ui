import { FC } from 'react';
import cx from 'classnames';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { WonRaffleListItem } from '@frakt/state/liquidations/types';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import styles from './WonRaffleCard.module.scss';

interface WonRaffleCardProps {
  raffle: WonRaffleListItem;
}

const WonRaffleCard: FC<WonRaffleCardProps> = ({ raffle }) => {
  const { nftImageUrl, nftName, nftFloorPrice, liquidationPrice, user } =
    raffle;

  const isWinner = false;

  return (
    <div className={styles.cardWrapper}>
      <div className={cx(styles.card, isWinner && styles.cardWinner)}>
        <GeneralCardInfo nftName={nftName} nftImageUrl={nftImageUrl} />
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={nftFloorPrice}
          />
          <StatsRaffleValues
            label="Liquidation price"
            value={liquidationPrice}
          />
          <StatsRaffleValues label="Winner">
            <div className={styles.winner}>
              <div className={styles.winnerBadge}>You!</div>
              <p className={styles.value}>{shortenAddress(user)}</p>
            </div>
          </StatsRaffleValues>
          <StatsRaffleValues label="Ended">
            <span>8 min ago</span>
          </StatsRaffleValues>
        </div>
      </div>
    </div>
  );
};

export default WonRaffleCard;
