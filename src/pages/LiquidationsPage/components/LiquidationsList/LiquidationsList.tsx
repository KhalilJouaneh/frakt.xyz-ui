import { FC, ReactNode, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import FilterCollections from '../../../../componentsNew/FilterCollections';
import { FetchItemsParams } from '../../../../state/liquidations/types';
import SortOrderButton from '../../../../components/SortOrderButton';
import { SearchInput } from '../../../../components/SearchInput';
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
  const { control, setSearch, setValue, collections, sort, setCollections } =
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
        <SearchInput
          onChange={(event) => setSearch(event.target.value || '')}
          className={styles.searchInput}
          placeholder="Search by name"
        />
        {withRafflesInfo && (
          <div className={styles.rafflesInfo}>
            <TicketsCounter tickets={lotteryTickets.quantity} />
          </div>
        )}

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
                <Controller
                  control={control}
                  name={LiquidationsListFormNames.SORT}
                  render={() => (
                    <div className={styles.sortingWrapper}>
                      {SORT_VALUES.map(({ label, value }, idx) => (
                        <div className={styles.sorting} key={idx}>
                          <SortOrderButton
                            label={label}
                            setValue={setValue}
                            sort={sort}
                            value={value}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                />
              </FiltersDropdown>
            )}
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default LiquidationsList;
