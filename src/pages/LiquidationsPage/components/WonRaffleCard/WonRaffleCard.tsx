import { FC } from 'react';
import cx from 'classnames';

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
        <div className={styles.nftInfo}>
          <img className={styles.nftImage} src={nftImageUrl} />
          <p className={styles.nftName}>{nftName}</p>
        </div>
        <div className={styles.statsValue}>
          <div className={cx(styles.totalValue, styles.opacity)}>
            <p className={styles.subtitle}>Floor price</p>
            <p className={styles.value}>{`${nftFloorPrice} SOL`}</p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>liquidation price</p>
            <p className={styles.value}>{`${liquidationPrice} SOL`}</p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>Winner</p>
            <div className={styles.winner}>
              <div className={styles.winnerBadge}>You!</div>
              <p className={styles.value}>{shortenAddress(user)}</p>
            </div>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>Ended</p>
            <p className={styles.value}>8 min ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WonRaffleCard;
