import { FC, ReactNode, useRef } from 'react';
import { useSelector } from 'react-redux';

import FilterCollections from '../../../../componentsNew/FilterCollections';
import { FetchItemsParams } from '../../../../state/liquidations/types';
import { LiquidationsListFormNames } from '../../model';
import styles from './LiquidationsList.module.scss';
import { TicketsCounter } from '../TicketsCounter';
import { useOnClickOutside } from '../../../../utils';
import Button from '../../../../components/Button';
import {
  SORT_VALUES as RAW_SORT_VALUES,
  SORT_VALUES_WITH_GRACE,
  useLiquidationsPage,
} from '../Liquidations';
import FiltersDropdown, {
  useFiltersModal,
} from '../../../../componentsNew/FiltersDropdown';
import {
  selectLotteryTickets,
  selectRaffleCollectionsDropdownData,
  selectGraceCollectionsDropdownData,
} from '../../../../state/liquidations/selectors';
import SortControl from '../../../../componentsNew/SortControl';

interface LiquidationsListProps {
  children: ReactNode;
  withRafflesInfo?: boolean;
  isGraceList?: boolean;
  fetchItemsFunc?: (params: FetchItemsParams) => void;
}

const LiquidationsList: FC<LiquidationsListProps> = ({
  children,
  withRafflesInfo,
  fetchItemsFunc,
  isGraceList,
}) => {
  const { control, setValue, collections, sort, setCollections } =
    useLiquidationsPage(fetchItemsFunc, isGraceList);

  const lotteryTickets = useSelector(selectLotteryTickets);

  const collectionsRaffleListDropdownData = useSelector(
    selectRaffleCollectionsDropdownData,
  );
  const collectionsGraceListDropdownData = useSelector(
    selectGraceCollectionsDropdownData,
  );
  const SORT_COLLECTIONS_VALUES = withRafflesInfo
    ? collectionsRaffleListDropdownData
    : collectionsGraceListDropdownData.map((item) => ({
        label: <span>{item.label}</span>,
        value: item.value,
      }));

  const SORT_VALUES = isGraceList ? SORT_VALUES_WITH_GRACE : RAW_SORT_VALUES;

  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  return (
    <>
      <div className={styles.searchWrapper}>
        <TicketsCounter tickets={lotteryTickets.quantity} />
        <div ref={ref}>
          <div className={styles.sortWrapper}>
            <Button type="tertiary" onClick={toggleFiltersModal}>
              Filters
            </Button>

            {filtersModalVisible && (
              <FiltersDropdown
                onCancel={closeFiltersModal}
                className={styles.filtersDropdown}
              >
                {!!SORT_COLLECTIONS_VALUES.length && (
                  <FilterCollections
                    setSelectedCollections={setCollections}
                    selectedCollections={collections}
                    options={SORT_COLLECTIONS_VALUES}
                  />
                )}
                <SortControl
                  control={control}
                  name={LiquidationsListFormNames.SORT}
                  options={SORT_VALUES}
                  sort={sort}
                  setValue={setValue}
                />
              </FiltersDropdown>
            )}
          </div>
        </div>
      </div>
      <div className={styles.rafflesList}>{children}</div>
    </>
  );
};

export default LiquidationsList;
