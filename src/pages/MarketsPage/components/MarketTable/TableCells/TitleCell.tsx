import { FC } from 'react';

import { MarketPreview } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const TitleCell: FC<{ market: MarketPreview }> = ({ market }) => {
  return (
    <div className={styles.row}>
      <div className={styles.imageWrapper}>
        <img src={market.collectionImage} className={styles.nftImage} />
      </div>
      <div className={styles.nftName}>{market.collectionName}</div>
    </div>
  );
};
