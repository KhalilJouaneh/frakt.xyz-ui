import { ArrowDownSmallIcon } from '../../icons';
import styles from './BorrowPage.module.scss';

export const FETCH_LIMIT = 10;

export const SORT_VALUES = [
  {
    label: (
      <span className={styles.sortName}>
        Name
        <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'name_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name
        <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'name_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Loan value
        <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'maxLoanValue_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Loan value
        <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'maxLoanValue_desc',
  },
];
