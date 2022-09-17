import classNames from 'classnames';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import { SolanaIcon } from '../../../../icons';
import { LedningPools } from '../../../../state/stats/types';
import Block from '../Block';
import styles from './MyDeposit.module.scss';

interface LendingProps {
  lendingPools: LedningPools[];
}

const MyDeposit: FC<LendingProps> = ({ lendingPools }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>My deposits</h3>
      <div className={styles.loansInfoWrapper}>
        <div className={styles.loansInfo}>
          <div className={styles.loansValue}>215 %</div>
          <p className={styles.subtitle}>Total apy</p>
        </div>
        <div className={styles.loansInfo}>
          <div className={styles.loansValue}>
            195.033 <SolanaIcon className={styles.icon} />
          </div>
          <p className={styles.subtitle}>Total liquidity</p>
        </div>
      </div>
      <div className={styles.header}>
        <p className={styles.headerTitle}>{lendingPools.length} Pools</p>
        <div className={styles.headerValues}>
          <p className={styles.headerTitle}>APY</p>
          <p className={styles.headerTitle}>Your liquidity</p>
        </div>
      </div>
      <div className={styles.table}>
        {lendingPools.map(
          ({ nftName, apr, image, tvl, collectionsCount }, idx) => (
            <div key={idx} className={styles.tableRow}>
              <div className={styles.tableInfo}>
                {image?.length > 1 ? (
                  <div
                    className={classNames(styles.poolImage, {
                      [styles.poolImageWithLabel]: collectionsCount - 2 > 0,
                    })}
                    data-collections-amount={`+${collectionsCount - 2}`}
                  >
                    <img className={styles.rowImage} src={image[0]} />
                    <img className={styles.rowImage} src={image[1]} />
                  </div>
                ) : (
                  <img className={styles.rowImage} src={image} />
                )}
                <p className={styles.nftName}>{nftName}</p>
              </div>
              <div className={styles.tableStats}>
                <p>{apr.toFixed(2)} %</p>
                <p>
                  {tvl.toFixed(2)} <SolanaIcon />
                </p>
              </div>
            </div>
          ),
        )}
      </div>
      <NavLink style={{ width: '100%' }} to={PATHS.BORROW}>
        <Button className={styles.btn} type="secondary">
          Borrow
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyDeposit;
