import { FC } from 'react';

import { SolanaIcon } from '../../../../icons';
import mockImage from './mockImage.png';
import styles from './BondPool.module.scss';

interface BondPoolProps {
  onClick?: () => void;
}

const BondPool: FC<BondPoolProps> = ({ onClick }) => {
  return (
    <>
      <div className={styles.pool} onClick={onClick}>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <img src={mockImage} className={styles.image} />
            <div className={styles.subtitle}>Solana Monkey Business</div>
          </div>
          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Offer TVL</p>
              <p className={styles.value}>
                <span>345.364 </span> <SolanaIcon />
              </p>
            </div>

            <div className={styles.toRedeem}>
              <p className={styles.title}>To Redeem</p>
              <p className={styles.value}>3 Bonds</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BondPool;
