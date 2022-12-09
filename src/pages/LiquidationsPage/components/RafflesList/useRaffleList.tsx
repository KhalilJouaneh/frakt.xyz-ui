// import { useSelector } from 'react-redux';

// import {
//   selectGraceCollections,
//   selectHistoryCollections,
//   selectRaffleCollections,
// } from '@frakt/state/liquidations/selectors';
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
  // SORT_COLLECTIONS_VALUES: SortValues[];
  SORT_VALUES: SortValues[];
} => {
  // const collectionsRaffleList = useSelector(selectRaffleCollections);
  // const collectionsGraceList = useSelector(selectGraceCollections);
  // const collectionsHistoryList = useSelector(selectHistoryCollections);

  // const getSortCollectionValues = () => {
  //   if (withRafflesInfo) return collectionsRaffleList;
  //   if (isGraceList) return collectionsGraceList;
  //   if (isWonList) return collectionsHistoryList;
  // };

  // const currentCollectionsList = getSortCollectionValues();

  // const SORT_COLLECTIONS_VALUES = (currentCollectionsList || []).map(
  //   (item) => ({
  //     label: <span>{item.label}</span>,
  //     value: item.value,
  //   }),
  // );

  const getSortValues = (): SortValues[] => {
    if (isGraceList) return SORT_VALUES_WITH_GRACE;
    if (isWonList) return SORT_VALUES_WITH_HISTORY;
    return SORT_VALUES_WITH_LIQUIDATION;
  };

  const SORT_VALUES = getSortValues();

  return {
    // SORT_COLLECTIONS_VALUES,
    SORT_VALUES,
  };
};
