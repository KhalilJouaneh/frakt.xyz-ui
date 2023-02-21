import styles from './TableCells.module.scss';
import { Solana } from '@frakt/icons';

export const createSolValueJSX = (value?: string) => (
  <span className={styles.value}>
    {value} <Solana />
  </span>
);

export const createOfferTvlJSX = (value?: string) => (
  <span className={styles.value}>
    {parseFloat(value)?.toFixed(3)} <Solana />
  </span>
);

export const createBestOfferJSX = (value = 0) => (
  <span className={styles.value}>
    {(value / 1e9)?.toFixed(3)} <Solana />
  </span>
);

export const createDurationJSX = (value: number[]) => (
  <span className={styles.value}>
    {value?.length ? `${value?.join(' / ')} days` : '--'}
  </span>
);

export const createAprJSX = (value) => (
  <span className={styles.value}>up to {(value || 0).toFixed(2)} %</span>
);
