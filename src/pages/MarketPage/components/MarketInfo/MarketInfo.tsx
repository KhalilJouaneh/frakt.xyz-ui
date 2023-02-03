import { FC, useMemo } from 'react';
import { sum, map, filter } from 'lodash';

import Button from '@frakt/components/Button';
import { Bond, Market } from '@frakt/api/bonds';
import {
  calcBondRedeemLamports,
  isBondAvailableToRedeem,
} from '@frakt/utils/bonds';
import { Solana } from '@frakt/icons';

import styles from './MarketInfo.module.scss';

interface MarketInfo {
  market: Market;
  bonds: Bond[];
  onClaimAll: () => void;
}

export const MarketInfo: FC<MarketInfo> = ({ market, bonds, onClaimAll }) => {
  const balance = sum(map(bonds, (bond) => bond.walletBalance));

  const bondsAvailableToRedeem = useMemo(() => {
    return filter(bonds, isBondAvailableToRedeem);
  }, [bonds]);

  const rewardLamports = sum(
    map(bondsAvailableToRedeem, calcBondRedeemLamports),
  );

  return (
    <div className={styles.bondMarket}>
      <div className={styles.bondMarketInfo}>
        <img src={market.collectionImage} className={styles.image} />
        <div className={styles.title}>{market.collectionName}</div>
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.info}>
          <div className={styles.balance}>
            <div className={styles.infoName}>balance</div>
            <div className={styles.infoValue}>
              {(balance / 1e6).toFixed(2)} {market?.fbondTokenName}
            </div>
          </div>
          <div className={styles.funded}>
            <div className={styles.infoName}>funded</div>
            <div className={styles.infoValue}>{bonds.length} loans</div>
          </div>
        </div>
        <div className={styles.rewards}>
          <div>
            <div className={styles.infoName}>rewards</div>
            <div className={styles.infoValue}>
              {(rewardLamports / 1e9).toFixed(2)} <Solana />
            </div>
          </div>
          <Button
            className={styles.btn}
            type="primary"
            disabled={!rewardLamports}
            onClick={onClaimAll}
          >
            Claim all
          </Button>
        </div>
      </div>
    </div>
  );
};
