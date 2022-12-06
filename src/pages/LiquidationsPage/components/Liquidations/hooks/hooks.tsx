import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { equals } from 'ramda';

import { useRaffleSort } from './useRaffleSort';
import { Tab } from '@frakt/components/Tabs';
import { usePrevious } from '@frakt/hooks';
import {
  FilterFormFieldsValues,
  RafflesListFormNames,
  RafflesSortValue,
} from '../../../model';

type UseLiquidationsPage = (isGraceList?: boolean) => {
  control: Control<FilterFormFieldsValues>;
  setCollections: (value?: []) => void;
  setValue?: any;
  collections: any;
  sort?: RafflesSortValue;
};

export const useLiquidationsPage: UseLiquidationsPage = (
  isGraceList?: boolean,
) => {
  const defaultSort = isGraceList
    ? { sortOrder: 'asc', sortBy: 'startedAt' }
    : { sortOrder: 'desc', sortBy: 'liquidationPrice' };

  const defaultSortValue = isGraceList
    ? {
        label: <span>Grace Period</span>,
        value: 'startedAt_asc',
      }
    : {
        label: <span>Liquidation Price</span>,
        value: 'liquidationPrice_desc',
      };

  const { publicKey } = useWallet();

  const [sortOrder, setSortOrder] = useState<string>(defaultSort.sortOrder);
  const [sortBy, setSortBy] = useState<string>(defaultSort.sortBy);
  const [collections, setCollections] = useState<[]>([]);

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
  const { setSortQuery } = useRaffleSort();

  const fetchItems = (params = {}): void => {
    const query = {
      sortBy,
      sort: sortOrder,
      collections: stringCollection,
      ...params,
    };

    setSortQuery(query);
  };

  useEffect(() => {
    const userPubKey = showMyRaffles ? publicKey?.toBase58() : '';

    fetchItems({ user: userPubKey });
  }, [showMyRaffles, publicKey]);

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
    if (equals(prevCollections, collections)) {
      return;
    }
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections]);

  return {
    control,
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
