import { CollectionsListItem } from '@frakt/api/raffle';
import { useRaffleCollections } from '../../hooks';
import {
  SORT_VALUES_WITH_GRACE,
  SORT_VALUES_WITH_HISTORY,
  SORT_VALUES_WITH_LIQUIDATION,
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
  const { collections } = useRaffleCollections();

  const getSortCollectionValues = (): CollectionsListItem[] => {
    if (withRafflesInfo) return collections?.raffleCollections || [];
    if (isGraceList) return collections?.graceCollections || [];
    if (isWonList) return collections?.historyCollections || [];
    return [];
  };

  const currentCollectionsList = getSortCollectionValues();

  const SORT_COLLECTIONS_VALUES = currentCollectionsList.map((item) => ({
    label: <span>{item}</span>,
    value: item,
  }));

  const getSortValues = (): SortValues[] => {
    if (isGraceList) return SORT_VALUES_WITH_GRACE;
    if (isWonList) return SORT_VALUES_WITH_HISTORY;
    return SORT_VALUES_WITH_LIQUIDATION;
  };

  const SORT_VALUES = getSortValues();

  return {
    SORT_COLLECTIONS_VALUES,
    SORT_VALUES,
  };
};
