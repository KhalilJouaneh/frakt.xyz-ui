import { FC } from 'react';
import classNames from 'classnames';

import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';

export const InterestCell: FC<{ bond: Bond; isMobile?: boolean }> = ({
  bond,
  isMobile,
}) => {
  const { interest, apy } = bond;

  return (
    <div
      className={classNames(styles.column, {
        [styles.columnMobile]: isMobile,
      })}
    >
      <span className={styles.value}> {(interest / 100 || 0).toFixed(0)}%</span>
      <span className={styles.value}>{apy.toFixed(0)}% APR</span>
    </div>
  );
};
