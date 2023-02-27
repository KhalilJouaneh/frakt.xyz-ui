import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

import { ArrowUp } from '@frakt/icons';

import Button from '../Button';
import styles from './Table.module.scss';

export interface Sort {
  field: string | null;
  direction: 'desc' | 'asc';
}

export interface SortModalMobileProps<T> {
  sortModalMobileVisible: boolean;
  closeModalMobile?: () => void;
  toggleModalMobile?: () => void;
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
              .map((column: any) => {
                const { key, title, defaultSortOrder } = column;

                const keyString = String(key);
                const lable = title?.(null)?.props.label || title;

                return (
                  <div className={styles.sortModalMobileSortWrapper} key={key}>
                    <div className={styles.sortModalMobileSortDirections}>
                      <Button
                        type="tertiary"
                        onClick={() =>
                          setSort({ field: keyString, direction: 'asc' })
                        }
                        className={classNames(styles.sortModalMobileSortAsc, {
                          [styles.sortModalMobileSortAscActive]:
                            keyString === sort.field &&
                            sort.direction === 'asc',
                        })}
                      >
                        {lable}
                        <ArrowUp />
                      </Button>
                      <Button
                        type="tertiary"
                        onClick={() =>
                          setSort({ field: keyString, direction: 'desc' })
                        }
                        className={classNames(styles.sortModalMobileSortDesc, {
                          [styles.sortModalMobileSortDescActive]:
                            (keyString === sort.field &&
                              sort.direction === 'desc') ||
                            (defaultSortOrder && !sort.field),
                        })}
                      >
                        {lable}
                        <ArrowUp className={styles.arrowDown} />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};
