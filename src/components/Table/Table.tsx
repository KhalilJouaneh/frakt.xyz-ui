import { Table as AntdTable } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { SortModalMobile, SortModalMobileProps } from './SortModalMobile';
import { useOnClickOutside, useWindowSize } from '../../hooks';
import { useFiltersModal } from '../FiltersDropdown';
import { MobileTable } from './MobileTable';
import { Loader } from '../Loader';
import { Search } from './Search';
import { useRef } from 'react';
import Button from '../Button';

import styles from './Table.module.scss';
import classNames from 'classnames';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  noDataMessage?: string;
  className?: string;
  mobileBreakpoint?: number;
  noDataClassName?: string;
  search?: {
    placeHolderText?: string;
    onChange: any;
  };
}

export interface TablePropsWithSortModalMobileProps<T>
  extends TableProps<T>,
    SortModalMobileProps<T> {}

const Table = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  sort,
  setSort,
  loading = false,
  search,
  // noDataMessage,
  noDataClassName,
  className,
  mobileBreakpoint = 1190,
}: TablePropsWithSortModalMobileProps<T>): JSX.Element => {
  const { width } = useWindowSize();
  const isMobile = width <= mobileBreakpoint;

  const {
    visible: sortModalMobileVisible,
    close: closeModalMobile,
    toggle: toggleModalMobile,
  } = useFiltersModal();

  const ref = useRef(null);
  useOnClickOutside(ref, closeModalMobile);

  if (loading) return <Loader />;

  if (isMobile && data?.length) {
    return (
      <>
        <div className={isMobile && styles.sortWrapper}>
          <Search
            onChange={search?.onChange}
            className={styles.searchInput}
            placeHolderText={search?.placeHolderText}
          />
          <div ref={ref}>
            <Button type="tertiary" onClick={toggleModalMobile}>
              Sorting
            </Button>
            <SortModalMobile
              columns={columns}
              setSort={setSort}
              sort={sort}
              sortModalMobileVisible={sortModalMobileVisible}
            />
          </div>
        </div>

        <MobileTable
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
        />
      </>
    );
  }

  return (
    <AntdTable
      className={classNames(className, {
        [noDataClassName]: !data.length && !loading,
      })}
      rowClassName={() => 'rowClassName'}
      columns={columns as ColumnsType}
      dataSource={data as any}
      pagination={false}
      sortDirections={['descend', 'ascend']}
      style={onRowClick && { cursor: 'pointer' }}
      rowKey={(data) => data[rowKeyField]}
      onRow={
        onRowClick
          ? (data) => ({
              onClick: () => onRowClick(data as T),
            })
          : null
      }
    />
  );
};

Table.Search = Search;

export { Table };
