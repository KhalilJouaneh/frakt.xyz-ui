import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { SolanaIcon } from '@frakt/icons';
import { PATHS } from '@frakt/constants';
import { BondPreview } from '@frakt/api/bonds';
import styles from './BondPool.module.scss';

interface BondPoolProps {
  bondPreview: BondPreview;
}

const BondPool: FC<BondPoolProps> = ({ bondPreview }) => {
  const { marketPubkey, collectionImage, collectionName, offerTVL } =
    bondPreview;

  return (
    <NavLink to={`${PATHS.BOND}/${marketPubkey}`} className={styles.pool}>
      <div className={styles.tokenInfo}>
        <img src={collectionImage} className={styles.image} />
        <div className={styles.subtitle}>{collectionName}</div>
      </div>
      <div className={styles.statsValue}>
        <div className={styles.totalValue}>
          <p className={styles.title}>Offer TVL</p>
          <p className={styles.value}>
            <span>{parseFloat(offerTVL).toFixed(2)}</span> <SolanaIcon />
          </p>
        </div>
        {/* <div className={styles.toRedeem}>
          <p className={styles.title}>To Redeem</p>
          <p className={styles.value}>3 Bonds</p>
        </div> */}
      </div>
    </NavLink>
  );
};

export default BondPool;
