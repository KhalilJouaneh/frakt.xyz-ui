import { FC, ReactNode, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { FilterFormInputsNames, RafflesListFormNames } from '../../model';
import FilterCollections from '@frakt/componentsNew/FilterCollections';
import SortControl from '@frakt/componentsNew/SortControl';
import { TicketsCounter } from '../TicketsCounter';
import { useOnClickOutside } from '@frakt/utils';
import styles from './RafflesList.module.scss';
import Toggle from '@frakt/components/Toggle';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/componentsNew/FiltersDropdown';
import {
  selectLotteryTickets,
  selectRaffleCollections,
  selectGraceCollections,
  selectHistoryCollections,
} from '@frakt/state/liquidations/selectors';
import {
  SORT_VALUES as RAW_SORT_VALUES,
  SORT_VALUES_WITH_GRACE,
  useLiquidationsPage,
} from '../Liquidations';

interface RafflesListProps {
  children: ReactNode;
  withRafflesInfo?: boolean;
  isGraceList?: boolean;
  isWonList?: boolean;
}

const RafflesList: FC<RafflesListProps> = ({
  children,
  withRafflesInfo,
  isGraceList,
  isWonList,
}) => {
  const { control, setValue, collections, sort, setCollections } =
    useLiquidationsPage(isGraceList);

  const lotteryTickets = useSelector(selectLotteryTickets);

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
                {isWonList && (
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
                )}
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
      {children}
    </>
  );
};

export default RafflesList;
