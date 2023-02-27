import { FC } from 'react';

import { MarketPreview } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const TitleCell: FC<{ market: MarketPreview }> = ({ market }) => {
  return (
    <div style={{ justifyContent: 'flex-start' }} className={styles.row}>
      <img src={market.collectionImage} className={styles.nftImage} />
      <div className={styles.nftName}>{market.collectionName}</div>
    </div>
  );
};
