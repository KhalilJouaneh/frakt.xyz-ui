import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Container } from '../../components/Layout';
import LendingPool from './components/LendingPool';
import styles from './LendPage.module.scss';
import { Loader } from '../../components/Loader';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from './hooks/useLendingPoolsFiltering';
import Toggle from '../../components/Toggle';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LendPage: FC = () => {
  const { control, setSearch, pools, showStakedOnlyToggle } =
    useLendingPoolsFiltering();

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
        <>
          <div className={styles.sortWrapper}>
            <SearchInput
              onChange={(event) => setSearch(event.target.value || '')}
              className={styles.searchInput}
              placeholder="Search by pool name"
            />
            <div className={styles.filters}>
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
                render={({ field: { ref, ...field } }) => (
                  <Select
                    valueContainerClassName={styles.sortingSelectContainer}
                    className={styles.sortingSelect}
                    label="Sort by"
                    name={InputControlsNames.SORT}
                    options={SORT_VALUES}
                    {...field}
                  />
                )}
              />
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
        </>
      </Container>
    </AppLayout>
  );
};

export default LendPage;
