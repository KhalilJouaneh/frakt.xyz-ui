import { FC, useState } from 'react';
import { Controller } from 'react-hook-form';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import LendingPool from './components/LendingPool';
import styles from './LendPage.module.scss';
import { Loader } from '../../components/Loader';
import { SearchInput } from '../../components/SearchInput';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from './hooks/useLendingPoolsFiltering';
import Toggle from '../../components/Toggle';
import FiltersDropdown from '../../components/FiltersDropdown';
import Button from '../../components/Button';
import SortOrderButton from '../../components/SortOrderButton';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LendPage: FC = () => {
  const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
    useLendingPoolsFiltering();

  const [filtersDropdownVisible, setFiltersDropdownVisible] =
    useState<boolean>(false);

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
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
          <div style={{ position: 'relative' }}>
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
                <Controller
                  control={control}
                  name={InputControlsNames.SORT}
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
      </Container>
    </AppLayout>
  );
};

export default LendPage;
