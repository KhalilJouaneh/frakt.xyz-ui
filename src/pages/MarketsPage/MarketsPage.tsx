import { FC, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import Button from '../../components/Button';
import { Header } from './components/Header';
import FiltersDropdown, {
  useFiltersModal,
} from '../../components/FiltersDropdown';
import MarketPreviewCard from './components/MarketCard';
import SortControl from '@frakt/components/SortControl';
import {
  SORT_VALUES,
  useLendingPoolsFiltering,
} from '../LendPage/hooks/useLendingPoolsFiltering';
import { useOnClickOutside } from '@frakt/hooks';
import { useMarketsPreview } from './hooks';
import { Loader } from '@frakt/components/Loader';
import Toggle from '@frakt/components/Toggle';
import FilterCollections from '@frakt/components/FilterCollections';
import styles from './MarketsPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const collectionsMock = [
  { value: 'Frakt' },
  { value: 'Pawnshop gnomies' },
  { value: 'Solpunks' },
];

const MarketsPreviewPage: FC = () => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const {
    control,
    sort,
    /* setSearch, pools, */ setValue,
    showStakedOnlyToggle,
  } = useLendingPoolsFiltering();
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const { marketsPreview, isLoading } = useMarketsPreview({
    /* //? Pass wallet pubkey to get user's bonds */
  });

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
      <div className={styles.markets}>
        {isLoading && <Loader size="large" />}
        {!isLoading &&
          marketsPreview.map((marketPreview) => (
            <MarketPreviewCard
              key={marketPreview.marketPubkey}
              marketPreview={marketPreview}
            />
          ))}
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
