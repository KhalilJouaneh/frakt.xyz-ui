import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { sortBy, path } from 'ramda';
import classNames from 'classnames';

import { LedningPools } from '../../../../state/stats/types';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import styles from './Lending.module.scss';
import Block from '../Block';

interface LendingProps {
  lendingPools: LedningPools[];
}

const Lending: FC<LendingProps> = ({ lendingPools }) => {
  const sortByApr = sortBy(path(['apr']));
  const highestAprPools = sortByApr(lendingPools).slice(-3);

  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>TOP 3 highest APYs</h3>
      <div className={styles.content}>
        {highestAprPools.map(
          ({ nftName, apr, image, collectionsCount }, idx) => (
            <div key={idx} className={styles.tableRow}>
              <div className={styles.tableInfo}>
                {collectionsCount ? (
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
              <p className={styles.value}>{apr.toFixed(2)} %</p>
            </div>
          ),
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
