import { FC, useRef } from 'react';
import { Controller } from 'react-hook-form';

import { useOnClickOutside } from '@frakt/hooks';
import { AppLayout } from '../../components/Layout/AppLayout';
import LendingPool from './components/LendingPool';
import styles from './LendPage.module.scss';
import { Loader } from '../../components/Loader';
import { SearchInput } from '../../components/SearchInput';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from './hooks/useLendingPoolsFiltering';
import Toggle from '../../components/Toggle';
import FiltersDropdown, {
  useFiltersModal,
} from '../../components/FiltersDropdown';
import Button from '../../components/Button';
import SortControl from '../../components/SortControl';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LendPage: FC = () => {
  const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
    useLendingPoolsFiltering();

  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  return (
    <AppLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Lend</h1>
          <h2 className={styles.subtitle}>
            Earn instant yield on SOL deposits
          </h2>
        </div>
      </div>

      <div className={styles.sortWrapper}>
        <SearchInput
          onChange={(event) => setSearch(event.target.value || '')}
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
                          label="Staked only"
                          className={styles.toggle}
                          name={InputControlsNames.SHOW_STAKED}
                          {...field}
                        />
                      )}
                    />
                  )}
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

      {pools ? (
        <div className={styles.sortWrapper}>
          {pools?.map((liquidityPool) => (
            <LendingPool
              key={liquidityPool.pubkey}
              liquidityPool={liquidityPool}
            />
          ))}
        </div>
      ) : (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      )}
    </AppLayout>
  );
};

export default LendPage;
