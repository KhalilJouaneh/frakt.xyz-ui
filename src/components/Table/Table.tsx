import { useRef } from 'react';
import { Table as AntdTable } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { SortModalMobile, SortModalMobileProps } from './SortModalMobile';
import { useOnClickOutside, useWindowSize } from '../../hooks';
import { useFiltersModal } from '../FiltersDropdown';
import { MobileTable } from './MobileTable';
import styles from './Table.module.scss';
import { Search } from './Search';
import { Loader } from '../Loader';
import { Button } from '../Button';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  noDataMessage?: string;
  className?: string;
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
  noDataMessage,
  className,
}: TablePropsWithSortModalMobileProps<T>): JSX.Element => {
  const { width } = useWindowSize();
  const isMobile = width <= 1380;

  const {
    visible: sortModalMobileVisible,
    close: closeModalMobile,
    toggle: toggleModalMobile,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeModalMobile);

  if (loading) return <Loader />;

  if (!loading && !data.length)
    return <p className={styles.noDataMessage}>{noDataMessage}</p>;

  if (isMobile) {
    return (
      <>
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
      className={className}
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
