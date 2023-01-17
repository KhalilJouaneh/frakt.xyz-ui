import { FC } from 'react';
import classNames from 'classnames/bind';

import { Solana } from '@frakt/icons';

import styles from './NftCard.module.scss';
import { BorrowNft, BorrowNftBulk } from '@frakt/api/nft';

interface NftCardProps {
  nft: BorrowNft | BorrowNftBulk;
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
}

export const NftCard: FC<NftCardProps> = ({
  nft,
  selected = false,
  highlighted = false,
  onClick = () => {},
}) => {
  const { name, imageUrl, timeBased, maxLoanValue, isCanFreeze } = nft;

  const isStakeAvailable = timeBased?.isCanStake || nft.priceBased?.isCanStake;

  return (
    <div
      className={classNames([
        styles.root,
        { [styles.rootSelected]: selected },
        { [styles.rootHighlighted]: highlighted },
      ])}
      onClick={onClick}
    >
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={imageUrl} alt={nft.name} />

        {selected && <div className={styles.imageSelectedOverlay} />}

        <div className={styles.badgesWrapper}>
          {isStakeAvailable && <p className={styles.badge}>Staking support</p>}
          {!isCanFreeze && <p className={styles.badge}>Leaves wallet</p>}
        </div>
      </div>
      <div className={styles.rootContent}>
        <p className={styles.title}>{name}</p>
        {!!maxLoanValue && (
          <div>
            <p className={styles.ltvTitle}>To borrow</p>
            <div className={styles.ltvContent}>
              <p className={styles.ltvText}>{maxLoanValue}</p>
              <Solana />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
