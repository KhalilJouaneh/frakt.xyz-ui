import { FC, ReactNode, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import {
  SORT_VALUES as RAW_SORT_VALUES,
  SORT_VALUES_WITH_GRACE,
  useLiquidationsPage,
} from '../Liquidations';
import {
  selectLotteryTickets,
  selectRaffleCollectionsDropdownData,
  selectGraceCollectionsDropdownData,
} from '../../../../state/liquidations/selectors';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import { FetchItemsParams } from '../../../../state/liquidations/types';
import { SearchInput } from '../../../../components/SearchInput';
import { Select } from '../../../../components/Select';
import styles from './LiquidationsList.module.scss';
import { TicketsCounter } from '../TicketsCounter';
import Button from '../../../../components/Button';
import SortOrderButton from '../../../../components/SortOrderButton';
import { LiquidationsListFormNames } from '../../model';
import FiltersDropdown from '../../../../components/FiltersDropdown';

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
  const { control, setSearch, setValue, sort, setCollections } =
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
        label: <span className={styles.sortName}>{item.label}</span>,
        value: item.value,
      }));

  const SORT_VALUES = isGraceList ? SORT_VALUES_WITH_GRACE : RAW_SORT_VALUES;

  const [filtersDropdownVisible, setFiltersDropdownVisible] =
    useState<boolean>(false);

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
            {/* <TicketsRefillCountdown /> */}
          </div>
        )}

        <div className={styles.sortWrapper}>
          <Button
            type="tertiary"
            onClick={() => setFiltersDropdownVisible(!filtersDropdownVisible)}
          >
            Filters
          </Button>
          {filtersDropdownVisible && (
            <FiltersDropdown
              onCancel={() => setFiltersDropdownVisible(false)}
              className={styles.filtersDropdown}
            >
              <Controller
                control={control}
                name={LiquidationsListFormNames.SORT}
                render={() => (
                  <div className={styles.sortingWrapper}>
                    {SORT_VALUES.map(({ label, value }, idx) => (
                      <div className={styles.sorting} key={idx}>
                        <p className={styles.label}>{label}</p>
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
          {/* <Controller
            control={control}
            name="collections"
            render={({ field: { ref, ...field } }) => (
              <CollectionDropdown
                className={styles.sortingSelect}
                name="collections"
                options={SORT_COLLECTIONS_VALUES}
                setValues={(evt) => {
                  setCollections(evt);
                }}
                {...field}
              />
            )}
          /> */}
        </div>
      </div>
      {children}
    </>
  );
};

export default LiquidationsList;
