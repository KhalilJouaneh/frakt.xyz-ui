import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { equals } from 'ramda';

import { FetchItemsParams } from '../../../../state/liquidations/types';
import { useDebounce, usePrevious } from '../../../../hooks';
import { Tab } from '../../../../components/Tabs';
import {
  FilterFormFieldsValues,
  LiquidationsListFormNames,
  LiquiditionsSortValue,
} from '../../model';

type FetchDataFunc = (params: FetchItemsParams) => void;

type UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
  isGraceList?: boolean,
) => {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
  setCollections: (value?: []) => void;
  setValue?: any;
  collections: any;
  sort?: LiquiditionsSortValue;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
  isGraceList?: boolean,
) => {
  const defaultSortIndex = isGraceList ? 2 : 1;
  const defaultSortBy = isGraceList ? 'startedAt' : 'liquidationPrice';
  const defaultSortOrder = isGraceList ? 'asc' : 'desc';

  const [sortOrder, setSortOrder] = useState<string>(defaultSortOrder);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [search, setSearch] = useState<string>('');
  const [collections, setCollections] = useState<[]>([]);
  const stringRef = useRef(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]:
        SORT_VALUES_WITH_GRACE[defaultSortIndex],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const sort = watch(LiquidationsListFormNames.SORT);
  const prevCollections = usePrevious(collections);

  const stringCollection = collections.map((value) => value).join(',');

  const fetchItems = (params = {}): void => {
    const query = {
      sortBy,
      sort: sortOrder,
      search: stringRef.current,
      collections: stringCollection,
      ...params,
    };
    fetchItemsFunc(query);
  };

  const searchDebounced = useDebounce((search: string): void => {
    stringRef.current = search;
    fetchItems();
  }, 300);

  useEffect(() => {
    const [newSortBy, newSortOrder] = sort.value.split('_');
    if (sortOrder === newSortOrder && sortBy === newSortBy) {
      return;
    }

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchItems({ sortBy: newSortBy, sort: newSortOrder });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort.value]);

  useEffect(() => {
    if (search === stringRef.current) {
      return;
    }
    searchDebounced(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (equals(prevCollections, collections)) {
      return;
    }
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  return {
    control,
    setSearch,
    setCollections,
    collections,
    setValue,
    sort,
  };
};

export const SORT_VALUES: LiquiditionsSortValue[] = [
  {
    label: <span>Name</span>,
    value: 'nftName_',
  },
  {
    label: <span>Liquidation Price</span>,
    value: 'liquidationPrice_',
  },
];

export const SORT_VALUES_WITH_GRACE = [
  ...SORT_VALUES,
  {
    label: <span>Grace Period</span>,
    value: 'startedAt_',
  },
];

export const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Ongoing',
    value: 'liquidations',
  },
  {
    label: 'Upcoming',
    value: 'grace',
  },
  {
    label: 'History',
    value: 'raffles',
  },
];
