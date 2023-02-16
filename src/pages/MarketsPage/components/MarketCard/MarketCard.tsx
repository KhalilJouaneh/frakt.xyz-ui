import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import { PATHS } from '@frakt/constants';
import { MarketPreview } from '@frakt/api/bonds';
import Tooltip from '@frakt/components/Tooltip';
import { Solana } from '@frakt/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './MarketCard.module.scss';

interface MarketCardProps {
  marketPreview: MarketPreview;
}

const MarketCard: FC<MarketCardProps> = ({ marketPreview: bondPreview }) => {
  const {
    marketPubkey,
    collectionImage,
    collectionName,
    offerTVL,
    walletRedeemAmount,
    apy,
    bestOffer,
    duration,
  } = bondPreview;

  return (
    <NavLink to={`${PATHS.BOND}/${marketPubkey}`} className={styles.market}>
      <div className={styles.wrapper}>
        <div className={styles.tokenInfo}>
          <img src={collectionImage} className={styles.image} />
          <div className={styles.title}>{collectionName}</div>
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.info}>
            <div className={styles.infoTitle}>
              <span>offer tvl </span>
              <Tooltip
                placement="bottom"
                overlay="Total liquidity currently available in active offers"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.infoValue}>
              <span>{Number(offerTVL)?.toFixed(3)}</span> <Solana />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>
              <span>best offer</span>
              <Tooltip
                placement="bottom"
                overlay="Highest loan amount offered for that collection"
              >
                <QuestionCircleOutlined className={styles.questionIcon} />
              </Tooltip>
            </div>
            <div className={styles.infoValue}>
              <span>{(bestOffer / 1e9)?.toFixed(3)}</span> <Solana />
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>duration</div>
            <div className={styles.infoValue}>
              {duration?.length ? `${duration?.join(' / ')} days` : '--'}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoTitle}>apy</div>
            <div
              className={classNames(styles.infoValue, styles.green, {
                [styles.negative]: false,
              })}
            >
              up to {(apy || 0).toFixed(2)} %
            </div>
          </div>
        </div>
      </div>

      <div className={styles.toRedeem}>
        <div className={styles.infoTitle}>To Redeem</div>
        <div className={classNames(styles.infoValue, styles.infoValueRedeem)}>
          {(walletRedeemAmount / 1e9 || 0)?.toFixed(2)}
          <Solana />
        </div>
      </div>
    </NavLink>
  );
};

export default MarketCard;
