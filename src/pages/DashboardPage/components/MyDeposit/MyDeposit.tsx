import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';
import classNames from 'classnames';

import { selectLiquidityPools } from '@frakt/state/loans/selectors';
import { calcWeightedAverage } from '@frakt/utils';
import Button from '@frakt/components/Button';
import { PATHS } from '@frakt/constants';
import { Solana } from '@frakt/icons';

import styles from './MyDeposit.module.scss';
import Block from '../Block';

const MyDeposit: FC = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const depositAmount = (pool) => pool?.userDeposit?.depositAmount;
  const depositApr = ({ depositApr }) => depositApr;
  const isPriceBased = ({ isPriceBased }) => isPriceBased;
  const imageUrl = ({ imageUrl }) => imageUrl[0];

  const depositedPools = filter(depositAmount, liquidityPools);
  const totalLiquidity = sum(map(depositAmount, depositedPools)) || 0;

  const isDeposited = depositedPools.length;

  const perpLiquidityPools = filter(isPriceBased, liquidityPools).splice(0, 10);
  const poolsImages = map(imageUrl, perpLiquidityPools);

  const otherPoolsCount = liquidityPools.length - 9;

  const depositedAmountsNumbers = map(depositAmount, depositedPools);
  const depositedAPRsNumbers = map(depositApr, depositedPools);

  const weightedAvarageApy = calcWeightedAverage(
    depositedAPRsNumbers,
    depositedAmountsNumbers,
  );

  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>My deposits</h3>
      {isDeposited ? (
        <>
          <div className={styles.loansInfoWrapper}>
            <div className={styles.loansInfo}>
              <div className={styles.loansValue}>
                {weightedAvarageApy.toFixed(0)} %
              </div>
              <p className={styles.subtitle}>Weighted APY</p>
            </div>
            <div className={styles.loansInfo}>
              <div className={styles.loansValue}>
                {totalLiquidity.toFixed(2)} <Solana className={styles.icon} />
              </div>
              <p className={styles.subtitle}>Total liquidity</p>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <div className={styles.header}>
              <p className={styles.headerTitle}>
                {depositedPools.length} Pools
              </p>
              <div className={styles.headerValues}>
                <p className={styles.headerTitle}>APY</p>
                <p className={styles.headerTitle}>Your liquidity</p>
              </div>
            </div>
            <div className={styles.table}>
              {depositedPools.map(
                ({
                  name,
                  depositApr,
                  userDeposit,
                  imageUrl,
                  collectionsAmount,
                }) => (
                  <div key={name} className={styles.tableRow}>
                    <div className={styles.tableInfo}>
                      {imageUrl?.length > 1 ? (
                        <div
                          className={classNames(styles.poolImage, {
                            [styles.poolImageWithLabel]:
                              collectionsAmount - 2 > 0,
                          })}
                          data-collections-amount={`+${collectionsAmount - 2}`}
                        >
                          <img className={styles.rowImage} src={imageUrl[0]} />
                          <img className={styles.rowImage} src={imageUrl[1]} />
                        </div>
                      ) : (
                        <img className={styles.rowImage} src={imageUrl[0]} />
                      )}
                      <p className={styles.nftName}>{name}</p>
                    </div>
                    <div className={styles.tableStats}>
                      <p>{depositApr.toFixed(2)} %</p>
                      <p>
                        {userDeposit?.depositAmount.toFixed(2)} <Solana />
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyContent}>
          <p className={styles.emptyMessage}>
            You have no deposits... <br /> But you can explore our offers and
            choose the best option for your deposit
          </p>
          <div className={styles.poolsImagesEmpty}>
            {poolsImages.map((url) => (
              <div key={url} className={styles.poolImageEmpty}>
                <img src={url} />
                <div className={styles.otherImage}>
                  <p className={styles.otherImageCount}>+{otherPoolsCount}</p>
                  <p className={styles.otherImageTitle}>profitable pools</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NavLink style={{ width: '100%' }} to={PATHS.LEND}>
        <Button className={styles.btn} type="secondary">
          {isDeposited ? 'Lend' : 'Refill deposit'}
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyDeposit;
