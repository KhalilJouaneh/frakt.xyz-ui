import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import cx from 'classnames';

import { useOnClickOutside } from '@frakt/hooks';
import { BorrowNft } from '@frakt/api/nft';
import { SearchInput } from '../../../../components/SearchInput';
import SortControl from '../../../../componentsNew/SortControl';
import Button from '../../../../components/Button';
import styles from './SortNfts.module.scss';
import {
  FilterFormInputsNames,
  SortValue,
  SORT_VALUES,
  useBorrowPageFilter,
} from '../../hooks';
import FiltersDropdown, {
  useFiltersModal,
} from '../../../../components/FiltersDropdown';

interface SortNftsProps {
  searchQuery: string;
  setSearch: (searchQuery: string) => void;
  selectedNfts: BorrowNft[];
  setSortValue: Dispatch<SetStateAction<SortValue>>;
}

const SortNfts: FC<SortNftsProps> = ({
  searchQuery,
  setSearch,
  selectedNfts,
  setSortValue,
}) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const { sort, setValue, control } = useBorrowPageFilter();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  useEffect(() => {
    setSortValue(sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <div className={styles.sortWrapper}>
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearch(e.target.value || '')}
        className={styles.searchInput}
        placeholder="Search by name"
      />
      <div ref={ref}>
        <div
          className={cx(
            styles.filters,
            selectedNfts.length && styles.filtersActive,
          )}
        >
          <Button type="tertiary" onClick={toggleFiltersModal}>
            Filters
          </Button>
          {filtersModalVisible && (
            <FiltersDropdown
              onCancel={closeFiltersModal}
              className={cx(
                styles.filtersDropdown,
                selectedNfts.length && styles.filtersDropdownActive,
              )}
            >
              <SortControl
                control={control}
                name={FilterFormInputsNames.SORT}
                options={SORT_VALUES}
                sort={sort}
                setValue={setValue}
              />
            </FiltersDropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortNfts;
