import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { descend, sort, prop } from 'ramda';
import classNames from 'classnames';

import { LedningPools } from '../../../../state/stats/types';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import styles from './Lending.module.scss';
import Block from '../Block';
import { Loader } from '@frakt/components/Loader';

interface LendingProps {
  lendingPools: LedningPools[];
  loading: boolean;
}

const Lending: FC<LendingProps> = ({ lendingPools, loading }) => {
  const sortByApr = descend(prop('apr') as any);
  const highestAprPools = sort(sortByApr, lendingPools).slice(
    0,
    3,
  ) as LedningPools[];

  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>TOP 3 highest APYs</h3>
      <div className={styles.content}>
        {loading || !highestAprPools?.length ? (
          <Loader size="large" />
        ) : (
          highestAprPools.map((pool, idx) => (
            <div key={idx} className={styles.tableRow}>
              <div className={styles.tableInfo}>
                {pool?.collectionsCount ? (
                  <div
                    className={classNames(styles.poolImage, {
                      [styles.poolImageWithLabel]:
                        pool?.collectionsCount - 2 > 0,
                    })}
                    data-collections-amount={`+${pool?.collectionsCount - 2}`}
                  >
                    <img className={styles.rowImage} src={pool?.image[0]} />
                    <img className={styles.rowImage} src={pool?.image[1]} />
                  </div>
                ) : (
                  <img className={styles.rowImage} src={pool?.image} />
                )}
                <p className={styles.nftName}>{pool?.nftName}</p>
              </div>
              <p className={styles.value}>{pool?.apr?.toFixed(2)} %</p>
            </div>
          ))
        )}
      </div>
      <NavLink to={PATHS.LEND}>
        <Button className={styles.btn} type="secondary">
          Lend
        </Button>
      </NavLink>
    </Block>
  );
};

export default Lending;
