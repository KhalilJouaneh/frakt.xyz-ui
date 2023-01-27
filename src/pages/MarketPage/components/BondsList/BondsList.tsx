import { FC, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import FilterCollections from '@frakt/components/FilterCollections';
import SortControl from '@frakt/components/SortControl';
import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import { SearchInput } from '@frakt/components/SearchInput';
import Toggle from '@frakt/components/Toggle';
import { useLendingPoolsFiltering } from '@frakt/pages/LendPage/hooks/useLendingPoolsFiltering';
import { Bond, Pair } from '@frakt/api/bonds';

import styles from './BondsList.module.scss';
import { BondCard } from '../BondCard';

interface BondsListProps {
  bonds: Bond[];
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

//TODO: Implemet normal filters
export const BondsList: FC<BondsListProps> = ({
  bonds,
  pairs,
  onRedeem,
  onExit,
}) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const {
    control,
    sort,
    /*setSearch, pools,*/ setValue,
    showStakedOnlyToggle,
  } = useLendingPoolsFiltering();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  const collectionsMock = [
    { value: 'Frakt' },
    { value: 'Pawnshop gnomies' },
    { value: 'Solpunks' },
  ];

  return (
    <div>
      <div className={styles.sortWrapper}>
        <SearchInput
          className={styles.searchInput}
          placeholder="Search by name"
        />
        <div className={styles.filtersWrapper} ref={ref}>
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
      <div className={styles.bondList}>
        {bonds.map((bond, idx) => (
          <BondCard
            key={idx}
            bond={bond}
            pairs={pairs}
            onRedeem={onRedeem}
            onExit={onExit}
          />
        ))}
      </div>
    </div>
  );
};

const SORT_VALUES = [
  {
    label: <span>Name</span>,
    value: 'name_',
  },
  {
    label: <span>Loan value</span>,
    value: 'maxLoanValue_',
  },
];

enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}
