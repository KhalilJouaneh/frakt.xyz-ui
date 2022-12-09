import { FC, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Controller } from 'react-hook-form';

import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import Header from '../BorrowPage/components/Header';
import Button from '../../components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '../../componentsNew/FiltersDropdown';
import BondPool from './components/BondPool';
import SortControl from '@frakt/componentsNew/SortControl';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from '../LendPage/hooks/useLendingPoolsFiltering';
import { useOnClickOutside } from '@frakt/hooks';
import Toggle from '@frakt/components/Toggle';
import FilterCollections from '@frakt/componentsNew/FilterCollections';
import { PATHS } from '@frakt/constants';
import styles from './BondsPoolPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const collectionsMock = [
  { value: 'Frakt' },
  { value: 'Pawnshop gnomies' },
  { value: 'Solpunks' },
];

const BondsPoolPage: FC = () => {
  const history = useHistory();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
    useLendingPoolsFiltering();
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const openBondPool = () => {
    history.push(PATHS.BOND);
  };

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  return (
    <AppLayout>
      <Header title="Bonds" subtitle="description" />
      <div className={styles.sortWrapper}>
        <SearchInput
          className={styles.searchInput}
          placeholder="Search by name"
        />
        <div ref={ref}>
          <div className={styles.filtersWrapper}>
            <Button type="tertiary" onClick={toggleFiltersModal}>
              Filters
            </Button>

            {filtersModalVisible && (
              <FiltersDropdown
                onCancel={closeFiltersModal}
                className={styles.filtersDropdown}
              >
                <div>
                  {showStakedOnlyToggle && (
                    <Controller
                      control={control}
                      name={InputControlsNames.SHOW_STAKED}
                      render={({ field: { ref, ...field } }) => (
                        <Toggle
                          label="My bag only"
                          className={styles.toggle}
                          name={InputControlsNames.SHOW_STAKED}
                          {...field}
                        />
                      )}
                    />
                  )}
                  <FilterCollections
                    options={collectionsMock}
                    selectedCollections={selectedCollections}
                    setSelectedCollections={setSelectedCollections}
                  />
                  <SortControl
                    control={control}
                    name={InputControlsNames.SORT}
                    options={SORT_VALUES}
                    sort={sort}
                    setValue={setValue}
                  />
                </div>
              </FiltersDropdown>
            )}
          </div>
        </div>
      </div>
      <div className={styles.pools}>
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
        <BondPool onClick={openBondPool} />
      </div>
    </AppLayout>
  );
};

export default BondsPoolPage;
