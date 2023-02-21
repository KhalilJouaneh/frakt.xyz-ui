import { FC } from 'react';

import styles from './TableCells.module.scss';

export const TitleCell: FC<{
  imgSrc: string;
  title: string;
}> = ({ imgSrc, title }) => (
  <div style={{ width: '100%' }} className={styles.row}>
    <img className={styles.nftImage} src={imgSrc} alt={title} />
    <span className={styles.nftName}>{title}</span>
  </div>
);
