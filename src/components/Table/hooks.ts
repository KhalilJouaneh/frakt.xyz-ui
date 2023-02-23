import { debounce, DebouncedFunc } from 'lodash';
import { useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { SortModalMobileProps } from './SortModalMobile';
import { TableProps, TablePropsWithSortModalMobileProps } from './Table';

type UseSearch = <T>(props: {
  data: ReadonlyArray<T>;
  searchField?: string;
  debounceWait?: number;
}) => {
  filteredData: ReadonlyArray<T>;
  onChange: DebouncedFunc<(event: any) => void>;
};

export const useSearch: UseSearch = ({
  data,
  searchField = 'name',
  debounceWait = 0,
}) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((dataElement) =>
      (dataElement[searchField] ?? '')
        .toUpperCase()
        .includes(search.toUpperCase()),
    );
  }, [search, data, searchField]);

  return {
    filteredData,
    onChange: debounce(
      (event) => setSearch(event.target.value || ''),
      debounceWait,
    ),
  };
};

type UseSortModalMobile = <T>(props: {
  data: ReadonlyArray<T>;
  columns: ColumnsType<T>;
}) => {
  modal: SortModalMobileProps<T>;
  sortedData: T[];
};

export const useSortModalMobile: UseSortModalMobile = ({ data, columns }) => {
  const [sortModalMobileVisible, setSortModalMobileVisible] = useState(false);
  const [sort, setSort] = useState<{
    field: string | null;
    direction: 'desc' | 'asc';
  }>({
    field: null,
    direction: 'desc',
  });

  const sortedData = useMemo(() => {
    if (!sort.field) return [...data];
    const sortFunction = columns.find(({ key }) => String(key) === sort.field)
      .sorter as any;

    if (!sortFunction) return [...data];

    if (sort.direction === 'desc') {
      return [...data].sort(sortFunction).reverse();
    }
    return [...data].sort(sortFunction);
  }, [sort, data, columns]);

  return {
    modal: {
      sortModalMobileVisible,
      setSortModalMobileVisible,
      sort,
      setSort,
      columns,
    },
    sortedData,
  };
};

interface UseTableProps<T> extends TableProps<T> {
  searchParams?: {
    searchField?: string;
    debounceWait?: number;
    placeHolderText?: string;
  };
}

type UseTable = <T>(props: UseTableProps<T>) => {
  table: TablePropsWithSortModalMobileProps<T>;
  search: {
    placeHolderText?: string;
    onChange: DebouncedFunc<(event: any) => void>;
  };
};

export const useTable: UseTable = ({
  data,
  columns,
  onRowClick,
  rowKeyField = 'id',
  loading,
  noDataMessage,
  searchParams = {
    debounceWait: 0,
    searchField: 'name',
    placeHolderText: 'Search by name',
  },
}) => {
  const { filteredData, onChange } = useSearch({
    data,
    searchField: searchParams.searchField ?? 'name',
    debounceWait: searchParams.debounceWait ?? 0,
  });

  const { modal: sortModalMobile, sortedData } = useSortModalMobile({
    data: filteredData,
    columns,
  });

  return {
    table: {
      data: sortedData,
      columns,
      onRowClick,
      rowKeyField,
      loading,
      noDataMessage,
      ...sortModalMobile,
    },
    search: {
      placeHolderText: searchParams.placeHolderText ?? 'Search by name',
      onChange,
    },
  };
};
