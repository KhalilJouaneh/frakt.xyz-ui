import { FC } from 'react';
import { equals } from 'ramda';
import moment from 'moment';
import cx from 'classnames';

import { GeneralCardInfo, StatsRaffleValues } from '../StatsRaffleValues';
import { shortenAddress } from '@frakt/utils/solanaUtils';
import styles from './WonRaffleCard.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { WonRaffleListItem } from '@frakt/api/raffle';
import SolscanNftLink from '../SolscanNftLink';

interface WonRaffleCardProps {
  raffle: WonRaffleListItem;
}

const WonRaffleCard: FC<WonRaffleCardProps> = ({ raffle }) => {
  const { publicKey } = useWallet();
  const isWinner = equals(raffle?.user, publicKey?.toBase58());

  return (
    <div className={styles.cardWrapper}>
      <div className={cx(styles.card, isWinner && styles.cardWinner)}>
        <div className={styles.content}>
          <GeneralCardInfo
            nftName={raffle?.nftName}
            nftImageUrl={raffle?.nftImageUrl}
            nftCollectionName={raffle?.nftCollectionName}
          />
          <SolscanNftLink nftMint={raffle?.nftMint} />
        </div>
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
          <StatsRaffleValues label="Winner spent">
            <span>{raffle?.winnerTickets} TICKETS</span>
          </StatsRaffleValues>
          <StatsRaffleValues label="Total spent">
            <span>{raffle?.totalTickets} TICKETS</span>
          </StatsRaffleValues>
          <StatsRaffleValues label="Ended">
            <span>{moment(raffle?.expiredAt).fromNow(false)}</span>
          </StatsRaffleValues>
        </div>
      </div>
    </div>
  );
};

export default WonRaffleCard;
