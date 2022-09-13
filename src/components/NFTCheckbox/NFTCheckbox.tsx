import React, { FC } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { SolanaIcon } from '../../icons';

interface NFTCheckboxInterface {
  className?: string;
  selected?: boolean;
  imageUrl?: string;
  name: string;
  onClick?: () => void;
  isCanFreeze?: boolean;
  loanValue?: string;
}

const NFTCheckbox: FC<NFTCheckboxInterface> = ({
  className,
  selected = false,
  imageUrl,
  name,
  onClick,
  loanValue,
  isCanFreeze,
}) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames([
          styles.root,
          { [styles.root_checked]: selected },
          className,
        ])}
        onClick={onClick}
      >
        <div
          className={styles.root__image}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className={styles.imageShadow} />
          {!isCanFreeze && (
            <div className={styles.badge}>
              <p className={styles.badgeTitle}>Leaves wallet</p>
            </div>
          )}
        </div>
        <div className={styles.root__content}>
          <p className={styles.root__title}>{name}</p>
          {!!loanValue && (
            <div>
              <p className={styles.ltvTitle}>To borrow</p>
              <div className={styles.ltvContent}>
                <p className={styles.ltvText}>{loanValue}</p>
                <SolanaIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NFTCheckbox);
