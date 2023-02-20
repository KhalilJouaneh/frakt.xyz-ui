import { Table as AntdTable } from 'antd';
import styles from './Table.module.scss';
import { Search } from './Search';
import { MobileTable } from './MobileTable';
import { SortModalMobile, SortModalMobileProps } from './SortModalMobile';
import { ColumnsType } from 'antd/es/table';
import { useWindowSize } from '../../hooks';
import { Loader } from '../Loader';

export interface TableProps<T> {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField?: string;
  loading?: boolean;
  noDataMessage?: string;
}

export interface TablePropsWithSortModalMobileProps<T>
  extends TableProps<T>,
    SortModalMobileProps<T> {}

const Table = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  sortModalMobileVisible,
  setSortModalMobileVisible: setModalMobileVisible,
  sort,
  setSort,
  loading = false,
  noDataMessage = 'no data found',
}: TablePropsWithSortModalMobileProps<T>): JSX.Element => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  if (loading) return <Loader />;

  if (!loading && !data.length)
    return <p className={styles.noDataMessage}>{noDataMessage}</p>;

  if (isMobile) {
    return (
      <>
        <MobileTable
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          rowKeyField={rowKeyField}
        />
        <SortModalMobile
          sortModalMobileVisible={sortModalMobileVisible}
          setSortModalMobileVisible={setModalMobileVisible}
          columns={columns}
          sort={sort}
          setSort={setSort}
        />
      </>
    );
  }

  return (
    <AntdTable
      rowClassName={() => 'rowClassName'}
      className={styles.desktopTableView}
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
