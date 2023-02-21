import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { ArrowUp } from '@frakt/icons';

import styles from './Table.module.scss';
import Button from '../Button';

export interface Sort {
  field: string | null;
  direction: 'desc' | 'asc';
}

export interface SortModalMobileProps<T> {
  sortModalMobileVisible: boolean;
  sort: Sort;
  setSort: (nextSort: Sort) => void;
  columns: ColumnsType<T>;
}

export const SortModalMobile = <T extends unknown>({
  sortModalMobileVisible,
  sort,
  setSort,
  columns,
}: SortModalMobileProps<T>): JSX.Element => {
  return (
    <>
      {sortModalMobileVisible && (
        <div
          className={classNames(styles.sortModalMobile, {
            [styles.sortModalMobileVisible]: sortModalMobileVisible,
          })}
        >
          <div className={styles.sortModalMobileBody}>
            {columns
              .filter(({ sorter }) => !!sorter)
              .map(({ key }) => (
                <div className={styles.sortModalMobileSortWrapper} key={key}>
                  <div className={styles.sortModalMobileSortDirections}>
                    <Button
                      type="tertiary"
                      onClick={() =>
                        setSort({
                          field: String(key),
                          direction: 'asc',
                        })
                      }
                      className={classNames(styles.sortModalMobileSortAsc, {
                        [styles.sortModalMobileSortAscActive]:
                          String(key) === sort.field &&
                          sort.direction === 'asc',
                      })}
                    >
                      {key}
                      <ArrowUp />
                    </Button>
                    <Button
                      type="tertiary"
                      onClick={() =>
                        setSort({
                          field: String(key),
                          direction: 'desc',
                        })
                      }
                      className={classNames(styles.sortModalMobileSortDesc, {
                        [styles.sortModalMobileSortDescActive]:
                          String(key) === sort.field &&
                          sort.direction === 'desc',
                      })}
                    >
                      {key}
                      <ArrowUp className={styles.arrowDown} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
