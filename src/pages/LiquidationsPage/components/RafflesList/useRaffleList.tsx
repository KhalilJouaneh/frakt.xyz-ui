import { useSelector } from 'react-redux';

import {
  selectGraceCollections,
  selectHistoryCollections,
  selectRaffleCollections,
} from '@frakt/state/liquidations/selectors';
import {
  SORT_VALUES_WITH_GRACE,
  SORT_VALUES as RAW_SORT_VALUES,
} from '../Liquidations';

type SortValues = {
  label: JSX.Element;
  value: any;
};

export const useRaffleList = ({
  withRafflesInfo,
  isGraceList,
  isWonList,
}: {
  withRafflesInfo: boolean;
  isGraceList: boolean;
  isWonList: boolean;
}): {
  SORT_COLLECTIONS_VALUES: SortValues[];
  SORT_VALUES: SortValues[];
} => {
  const collectionsRaffleList = useSelector(selectRaffleCollections);
  const collectionsGraceList = useSelector(selectGraceCollections);
  const collectionsHistoryList = useSelector(selectHistoryCollections);

  const getSortCollectionValues = () => {
    if (withRafflesInfo) return collectionsRaffleList;
    if (isGraceList) return collectionsGraceList;
    if (isWonList) return collectionsHistoryList;
  };

  const currentCollectionsList = getSortCollectionValues();

  const SORT_COLLECTIONS_VALUES = currentCollectionsList.map((item) => ({
    label: <span>{item.label}</span>,
    value: item.value,
  }));

  const SORT_VALUES = isGraceList ? SORT_VALUES_WITH_GRACE : RAW_SORT_VALUES;

  return { SORT_COLLECTIONS_VALUES, SORT_VALUES };
};
