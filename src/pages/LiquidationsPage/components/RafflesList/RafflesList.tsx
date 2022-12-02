import { FC, ReactNode, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import FilterCollections from '@frakt/componentsNew/FilterCollections';
import { FetchItemsParams } from '@frakt/state/liquidations/types';
import SortControl from '@frakt/componentsNew/SortControl';
import { TicketsCounter } from '../TicketsCounter';
import { FilterFormInputsNames, RafflesListFormNames } from '../../model';
import { useOnClickOutside } from '@frakt/utils';
import styles from './RafflesList.module.scss';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/componentsNew/FiltersDropdown';
import {
  selectLotteryTickets,
  selectRaffleCollectionsDropdownData,
  selectGraceCollectionsDropdownData,
} from '@frakt/state/liquidations/selectors';
import {
  SORT_VALUES as RAW_SORT_VALUES,
  SORT_VALUES_WITH_GRACE,
  useLiquidationsPage,
} from '../Liquidations';
import Toggle from '@frakt/components/Toggle';

interface RafflesListProps {
  children: ReactNode;
  withRafflesInfo?: boolean;
  isGraceList?: boolean;
  fetchItemsFunc?: (params: FetchItemsParams) => void;
}

const RafflesList: FC<RafflesListProps> = ({
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
        <TicketsCounter tickets={lotteryTickets?.totalTickets} />
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
                <Controller
                  control={control}
                  name={RafflesListFormNames.SHOW_MY_RAFFLES}
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      label="My prizes only"
                      className={styles.toggle}
                      name={FilterFormInputsNames.SHOW_MY_RAFFLES}
                      {...field}
                    />
                  )}
                />
                {!!SORT_COLLECTIONS_VALUES.length && (
                  <FilterCollections
                    setSelectedCollections={setCollections}
                    selectedCollections={collections}
                    options={SORT_COLLECTIONS_VALUES}
                  />
                )}
                <SortControl
                  control={control}
                  name={RafflesListFormNames.SORT}
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

export default RafflesList;
