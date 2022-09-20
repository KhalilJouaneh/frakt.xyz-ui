import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sum, map, filter } from 'ramda';
import classNames from 'classnames';

import { selectLiquidityPools } from '../../../../state/loans/selectors';
import Button from '../../../../components/Button';
import styles from './MyDeposit.module.scss';
import { SolanaIcon } from '../../../../icons';
import { PATHS } from '../../../../constants';
import Block from '../Block';

const MyDeposit: FC = () => {
  const liquidityPools = useSelector(selectLiquidityPools);

  const depositAmount = ({ userDeposit }) => userDeposit?.depositAmount;
  const depositApr = ({ depositApr }) => depositApr;

  const depositedPools = filter(depositAmount as any, liquidityPools);
  const totalLiquidity = sum(map(depositAmount as any, depositedPools));
  const totalApy = sum(map(depositApr, depositedPools)) / depositedPools.length;

  return (
    <Block className={styles.block}>
      <h3 className={styles.title}>My deposits</h3>
      <div className={styles.loansInfoWrapper}>
        <div className={styles.loansInfo}>
          <div className={styles.loansValue}>{totalApy.toFixed(0)} %</div>
          <p className={styles.subtitle}>Total apy</p>
        </div>
        <div className={styles.loansInfo}>
          <div className={styles.loansValue}>
            {totalLiquidity.toFixed(3)} <SolanaIcon className={styles.icon} />
          </div>
          <p className={styles.subtitle}>Total liquidity</p>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.header}>
          <p className={styles.headerTitle}>{depositedPools.length} Pools</p>
          <div className={styles.headerValues}>
            <p className={styles.headerTitle}>APY</p>
            <p className={styles.headerTitle}>Your liquidity</p>
          </div>
        </div>
        <div className={styles.table}>
          {depositedPools.map(
            (
              { name, depositApr, userDeposit, imageUrl, collectionsAmount },
              idx,
            ) => (
              <div key={idx} className={styles.tableRow}>
                <div className={styles.tableInfo}>
                  {imageUrl?.length > 1 ? (
                    <div
                      className={classNames(styles.poolImage, {
                        [styles.poolImageWithLabel]: collectionsAmount - 2 > 0,
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
                    {userDeposit?.depositAmount.toFixed(2)} <SolanaIcon />
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <NavLink style={{ width: '100%' }} to={PATHS.LEND}>
        <Button className={styles.btn} type="secondary">
          Lend
        </Button>
      </NavLink>
    </Block>
  );
};

export default MyDeposit;
