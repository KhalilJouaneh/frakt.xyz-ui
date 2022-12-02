import { FC } from 'react';
import cx from 'classnames';

import { GraceListItem } from '@frakt/state/liquidations/types';
import { SolanaIcon, Timer } from '@frakt/icons';
import styles from './GraceCard.module.scss';
import { createTimerJSX } from '@frakt/utils';

interface GraceCardProps {
  raffle: GraceListItem;
}

const GraceCard: FC<GraceCardProps> = ({ raffle }) => {
  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={raffle.nftImageUrl} />
        <p className={styles.nftName}>{raffle.nftName}</p>
      </div>
      <div className={styles.statsValue}>
        <div className={cx(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>Floor price</p>
          <p className={styles.value}>
            {`${raffle.valuation}`}
            <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>
            {`${raffle.liquidationPrice}`}
            <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>Grace period</p>
          <div className={styles.wrapper}>
            <Timer />
            <div>
              <div className={styles.countdown}>
                {createTimerJSX(raffle.expiredAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraceCard;
