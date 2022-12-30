import { FC, ReactNode, useRef } from 'react';
import { Controller } from 'react-hook-form';

import { FilterFormInputsNames, RafflesListFormNames } from '../../model';
import FilterCollections from '@frakt/components/FilterCollections';
import SortControl from '@frakt/componentsNew/SortControl';
import { TicketsCounter } from '../TicketsCounter';
import { useOnClickOutside } from '@frakt/hooks';
import styles from './RafflesList.module.scss';
import Toggle from '@frakt/components/Toggle';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/componentsNew/FiltersDropdown';
import { useLiquidationsPage } from '../Liquidations';
import { useRaffleList } from './useRaffleList';
import { useSelector } from 'react-redux';
import { selectLotteryTickets } from '@frakt/state/liquidations/selectors';

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
  const lotteryTickets = useSelector(selectLotteryTickets);

  const { control, setValue, collections, sort, setCollections } =
    useLiquidationsPage(isGraceList, isWonList);

  const { SORT_VALUES, SORT_COLLECTIONS_VALUES } = useRaffleList({
    withRafflesInfo,
    isGraceList,
    isWonList,
  });

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
        <TicketsCounter
          currentTickets={lotteryTickets?.currentTickets}
          totalTickets={lotteryTickets?.totalTickets}
        />
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
