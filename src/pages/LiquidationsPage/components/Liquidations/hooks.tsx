import { useEffect, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { compose, join, pluck, equals } from 'ramda';

import { Tab } from '../../../../components/Tabs';
import { ArrowDownSmallIcon } from '../../../../icons';
import styles from '../LiquidationsList/LiquidationsList.module.scss';
import { useDebounce, usePrevious } from '../../../../hooks';
import {
  FilterFormFieldsValues,
  LiquidationsListFormNames,
  LiquiditionsSortValue,
} from '../../model';
import { FetchItemsParams } from '../../../../state/liquidations/types';

type FetchDataFunc = (params: FetchItemsParams) => void;

type UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
  isGraceList?: boolean,
) => {
  control: Control<FilterFormFieldsValues>;
  setSearch: (value?: string) => void;
  setCollections: (value?: []) => void;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  fetchItemsFunc: FetchDataFunc,
  isGraceList?: boolean,
) => {
  const defaultSortIndex = isGraceList ? 4 : 3;
  const defaultSortBy = isGraceList ? 'startedAt' : 'liquidationPrice';
  const defaultSortOrder = isGraceList ? 'asc' : 'desc';

  const [sortOrder, setSortOrder] = useState<string>(defaultSortOrder);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [search, setSearch] = useState<string>('');
  const [collections, setCollections] = useState<[]>([]);
  const stringRef = useRef(null);

  const { control, watch } = useForm({
    defaultValues: {
      [LiquidationsListFormNames.SORT]:
        SORT_VALUES_WITH_GRACE[defaultSortIndex],
      [LiquidationsListFormNames.COLLECTIONS_SORT]: null,
    },
  });

  const sort = watch(LiquidationsListFormNames.SORT);
  const prevCollections = usePrevious(collections);

  const fetchItems = (params = {}): void => {
    const query = {
      sortBy,
      sort: sortOrder,
      search: stringRef.current,
      collections: compose(
        decodeURIComponent,
        join(','),
        pluck('value'),
      )(collections),
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
  };
};

export const SORT_VALUES: LiquiditionsSortValue[] = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'nftName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'nftName_desc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidationPrice_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Liquidation Price <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidationPrice_desc',
  },
];

export const SORT_VALUES_WITH_GRACE = [
  ...SORT_VALUES,
  {
    label: (
      <span className={styles.sortName}>
        Grace Period <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'startedAt_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Grace Period <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'startedAt_desc',
  },
];

export const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Ongoing raffles',
    value: 'liquidations',
  },
  {
    label: 'Grace List',
    value: 'grace',
  },
  {
    label: 'Raffles I won',
    value: 'raffles',
  },
];
