import { FC } from 'react';
import classNames from 'classnames/bind';

import { Solana } from '@frakt/icons';
import { BorrowNft } from '@frakt/api/nft';

import styles from './NftCard.module.scss';

interface NftCardProps {
  nft: BorrowNft;
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
  const { name, imageUrl, classicParams, freezable, stakingAvailable } = nft;

  const maxLoanValue = classicParams?.maxLoanValue; //TODO Calc dynamic max loan value here

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

        <div className={styles.badgesContainer}>
          {stakingAvailable && <p className={styles.badge}>Staking support</p>}
          {!freezable && <p className={styles.badge}>Leaves wallet</p>}
        </div>
      </div>
      <div className={styles.rootContent}>
        <p className={styles.title}>{name}</p>
        {!!maxLoanValue && (
          <div>
            <p className={styles.ltvTitle}>To borrow</p>
            <div className={styles.ltvContent}>
              <p className={styles.ltvText}>
                {(maxLoanValue / 1e9)?.toFixed(2)}
              </p>
              <Solana />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
