import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { equals } from 'ramda';

import { FetchItemsParams } from '../../../../state/liquidations/types';
import { useDebounce, usePrevious } from '../../../../hooks';
import { Tab } from '../../../../components/Tabs';
import {
  FilterFormFieldsValues,
  RafflesListFormNames,
  RafflesSortValue,
} from '../../model';

type FetchDataFunc = (params: FetchItemsParams) => void;

type UseLiquidationsPage = (
  fetchItemsFunc?: FetchDataFunc,
  isGraceList?: boolean,
  isWonList?: boolean,
) => {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
  setCollections: (value?: []) => void;
  setValue?: any;
  collections: any;
  sort?: RafflesSortValue;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
  isGraceList?: boolean,
) => {
  const defaultSortValue = isGraceList
    ? {
        label: <span>Grace Period</span>,
        value: 'startedAt_asc',
      }
    : {
        label: <span>Liquidation Price</span>,
        value: 'liquidationPrice_desc',
      };

  const [sortOrder, setSortOrder] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [collections, setCollections] = useState<[]>([]);
  const stringRef = useRef(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [RafflesListFormNames.SORT]: defaultSortValue,
      [RafflesListFormNames.COLLECTIONS_SORT]: null,
      [RafflesListFormNames.SHOW_MY_RAFFLES]: false,
    },
  });

  const sort = watch(RafflesListFormNames.SORT);
  const showMyRaffles = watch(RafflesListFormNames.SHOW_MY_RAFFLES);

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

export const SORT_VALUES: RafflesSortValue[] = [
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

export const RAFFLES_TABS: Tab[] = [
  {
    label: 'Ongoing',
    value: 'ongoing',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
  },
  {
    label: 'History',
    value: 'history',
  },
];
