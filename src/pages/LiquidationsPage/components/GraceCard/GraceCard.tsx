import { FC } from 'react';
import cx from 'classnames';
import moment from 'moment';

import { SolanaIcon, Timer } from '../../../../icons';
import { useCountdown } from '../../../../hooks';
import styles from './GraceCard.module.scss';

const GraceCard: FC<{ data }> = ({ data }) => {
  const { timeLeft } = useCountdown(moment(data.expiredAt).unix());

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={data.nftImageUrl} />
        <p className={styles.nftName}>{data.nftName}</p>
      </div>
      <div className={styles.statsValue}>
        <div className={cx(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>Floor price</p>
          <p className={styles.value}>
            {`${data.valuation}`}
            <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>
            {`${data.liquidationPrice}`}
            <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>Grace period</p>
          <div className={styles.wrapper}>
            <Timer />
            <div>
              <div className={styles.countdown}>
                {timeLeft.days}d<p>:</p>
                {timeLeft.hours}h<p>:</p>
                {timeLeft.minutes}m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraceCard;
