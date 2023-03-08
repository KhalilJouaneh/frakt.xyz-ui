import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './NftCard.module.scss';

interface NftCardProps {
  nftName: string;
  nftImageUrl: string;
  children: ReactNode;
  className?: string;
}

const NftCard: FC<NftCardProps> = ({
  nftName,
  nftImageUrl,
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.card, className)}>
      <div className={styles.nftInfo}>
        <img src={nftImageUrl} className={styles.nftImage} />
        <p className={styles.nftName}>{nftName}</p>
      </div>
      {children}
    </div>
  );
};

export default NftCard;
