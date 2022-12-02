import { FC } from 'react';
import cx from 'classnames';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { WonRaffleListItem } from '@frakt/state/liquidations/types';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import styles from './WonRaffleCard.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';

interface WonRaffleCardProps {
  raffle: WonRaffleListItem;
}

const WonRaffleCard: FC<WonRaffleCardProps> = ({ raffle }) => {
  const { publicKey } = useWallet();

  const isWinner = raffle?.user === publicKey?.toBase58();

  return (
    <div className={styles.cardWrapper}>
      <div className={cx(styles.card, isWinner && styles.cardWinner)}>
        <GeneralCardInfo
          nftName={raffle?.nftName}
          nftImageUrl={raffle?.nftImageUrl}
        />
        <div className={styles.statsValue}>
          <StatsRaffleValues
            className={styles.opacity}
            label="Floor price"
            value={raffle?.nftFloorPrice}
          />
          <StatsRaffleValues
            label="Liquidation price"
            value={raffle?.liquidationPrice}
          />
          <StatsRaffleValues label="Winner">
            {isWinner ? (
              <div className={styles.winner}>
                <div className={styles.winnerBadge}>You!</div>
                <p className={styles.value}>
                  {raffle?.user && shortenAddress(raffle?.user)}
                </p>
              </div>
            ) : (
              <p className={styles.value}>
                {raffle?.user && shortenAddress(raffle?.user)}
              </p>
            )}
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
