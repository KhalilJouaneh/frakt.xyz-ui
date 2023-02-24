import styles from './TableCells.module.scss';
import { Solana } from '@frakt/icons';
import classNames from 'classnames';

export const createSolValueJSX = (value?: string) => (
  <span className={styles.value}>
    {value} <Solana />
  </span>
);

export const createActiveLoansJSX = (value = 0) => (
  <span className={styles.value}>{value || '--'}</span>
);

export const createOfferTvlJSX = (value?: string) => (
  <span className={styles.value}>
    {parseFloat(value)?.toFixed(1)} <Solana />
  </span>
);

export const createBestOfferJSX = (value = 0) => (
  <span className={styles.value}>
    {(value / 1e9)?.toFixed(2)} <Solana />
  </span>
);

export const createDurationJSX = (value: number[]) => (
  <span className={styles.value}>
    {value?.length ? `${value?.join(' / ')} days` : '--'}
  </span>
);

export const createHighestLtvJSX = (value = 0) => (
  <span className={classNames(styles.value, styles.highestLtvColor)}>
    {value?.toFixed(0)} %
  </span>
);

export const createAprJSX = (value) => (
  <span className={classNames(styles.value, styles.upToLtvColor)}>
    up to {(value || 0).toFixed(2)} %
  </span>
);
