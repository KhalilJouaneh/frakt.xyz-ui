import styles from './Table.module.scss';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';

export interface Sort {
  field: string | null;
  direction: 'desc' | 'asc';
}

export interface SortModalMobileProps<T> {
  sortModalMobileVisible: boolean;
  setSortModalMobileVisible: (visible: boolean) => void;
  sort: Sort;
  setSort: (nextSort: Sort) => void;
  columns: ColumnsType<T>;
}

export const SortModalMobile = <T extends unknown>({
  sortModalMobileVisible,
  setSortModalMobileVisible,
  sort,
  setSort,
  columns,
}: SortModalMobileProps<T>): JSX.Element => {
  return (
    <>
      {/* Hide modal when click outside */}
      {sortModalMobileVisible && (
        <div
          className={styles.upBackdrop}
          onClick={() => {
            setSortModalMobileVisible(false);
          }}
        />
      )}
      <div
        className={classNames(styles.sortModalMobile, {
          [styles.sortModalMobileVisible]: sortModalMobileVisible,
        })}
      >
        <div
          className={styles.sortModalMobileHeader}
          onClick={() => setSortModalMobileVisible(false)}
        >
          <p>sort</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="12"
            viewBox="0 0 17 12"
          >
            <path d="M15.9726 0.857422H14.4659C14.3635 0.857422 14.2671 0.907645 14.2068 0.990011L8.49942 8.85698L2.79205 0.990011C2.73178 0.907645 2.63535 0.857422 2.5329 0.857422H1.0262C0.895623 0.857422 0.819283 1.00608 0.895623 1.11256L7.9791 10.878C8.23625 11.2315 8.76259 11.2315 9.01772 10.878L16.1012 1.11256C16.1796 1.00608 16.1032 0.857422 15.9726 0.857422V0.857422Z" />
          </svg>
        </div>
        <div className={styles.sortModalMobileBody}>
          {columns
            .filter(({ sorter }) => !!sorter)
            .map(({ key, title }) => (
              <div className={styles.sortModalMobileSortWrapper} key={key}>
                <p className={styles.sortModalMobileSortTitle}>{title}</p>
                <div className={styles.sortModalMobileSortDirections}>
                  <div
                    onClick={() =>
                      setSort({
                        field: String(key),
                        direction: 'asc',
                      })
                    }
                    className={classNames(styles.sortModalMobileSortAsc, {
                      [styles.sortModalMobileSortAscActive]:
                        String(key) === sort.field && sort.direction === 'asc',
                    })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path d="M14.9024 8.67227L8.2348 0.988113C8.17453 0.918581 8.10002 0.862817 8.01631 0.824599C7.93261 0.786381 7.84167 0.766602 7.74965 0.766602C7.65763 0.766602 7.56669 0.786381 7.48298 0.824599C7.39927 0.862817 7.32476 0.918581 7.26449 0.988113L0.598866 8.67227C0.578724 8.69543 0.565663 8.72389 0.561241 8.75426C0.556819 8.78464 0.56122 8.81564 0.573922 8.84359C0.586623 8.87153 0.607089 8.89523 0.632882 8.91187C0.658675 8.92851 0.688707 8.93739 0.719401 8.93744H2.34663C2.43904 8.93744 2.52744 8.89727 2.58971 8.82695L6.98726 3.75843V15.0707C6.98726 15.1591 7.05958 15.2314 7.14797 15.2314H8.35333C8.44172 15.2314 8.51404 15.1591 8.51404 15.0707V3.75843L12.9116 8.82695C12.9719 8.89727 13.0603 8.93744 13.1547 8.93744H14.7819C14.9185 8.93744 14.9928 8.77673 14.9024 8.67227Z" />
                    </svg>
                  </div>
                  <div
                    onClick={() =>
                      setSort({
                        field: String(key),
                        direction: 'desc',
                      })
                    }
                    className={classNames(styles.sortModalMobileSortDesc, {
                      [styles.sortModalMobileSortDescActive]:
                        String(key) === sort.field && sort.direction === 'desc',
                    })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                    >
                      <path d="M0.0975614 7.32773L6.7652 15.0119C6.82547 15.0814 6.89998 15.1372 6.98369 15.1754C7.06739 15.2136 7.15833 15.2334 7.25035 15.2334C7.34237 15.2334 7.43331 15.2136 7.51702 15.1754C7.60073 15.1372 7.67524 15.0814 7.73551 15.0119L14.4011 7.32773C14.4213 7.30457 14.4343 7.27611 14.4388 7.24574C14.4432 7.21536 14.4388 7.18436 14.4261 7.15641C14.4134 7.12847 14.3929 7.10477 14.3671 7.08813C14.3413 7.07149 14.3113 7.06261 14.2806 7.06256H12.6534C12.561 7.06256 12.4726 7.10273 12.4103 7.17305L8.01274 12.2416L8.01274 0.929296C8.01274 0.840903 7.94042 0.768582 7.85203 0.768582L6.64667 0.768582C6.55828 0.768582 6.48596 0.840903 6.48596 0.929296L6.48596 12.2416L2.08841 7.17305C2.02814 7.10273 1.93975 7.06256 1.84533 7.06256H0.218097C0.0814899 7.06256 0.00715958 7.22327 0.0975614 7.32773Z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
