import React, { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Solana } from '@frakt/icons';

interface NFTCheckboxInterface {
  className?: string;
  selected?: boolean;
  imageUrl?: string;
  name: string;
  onClick?: () => void;
  isCanFreeze?: boolean;
  loanValue?: string;
  isCanStake?: boolean;
  isBulk?: boolean;
}

const NFTCheckbox: FC<NFTCheckboxInterface> = ({
  className,
  selected = false,
  imageUrl,
  name,
  onClick,
  loanValue,
  isCanFreeze,
  isCanStake,
  isBulk,
}) => {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.wrapper_checked]: selected,
      })}
    >
      <div
        className={classNames([
          styles.root,
          { [styles.root_isBulk]: selected },
          className,
        ])}
        onClick={onClick}
      >
        <div
          className={styles.root__image}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {selected && (
            <div className={styles.imageShadow}>
              <div className={styles.line} />
            </div>
          )}
          <div className={styles.badges}>
            {isCanStake && (
              <div className={styles.badge}>
                <p className={styles.badgeTitle}>Staking support</p>
              </div>
            )}
            {!isCanFreeze && (
              <div className={styles.badge}>
                <p className={styles.badgeTitle}>Leaves wallet</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.root__content}>
          <p className={styles.root__title}>{name}</p>
          {!!loanValue && (
            <div>
              <p className={styles.ltvTitle}>To borrow</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{loanValue}</p>
                <Solana />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NFTCheckbox);
