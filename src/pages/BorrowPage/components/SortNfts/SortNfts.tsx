import { FC, useRef } from 'react';
import cx from 'classnames';

import { SearchInput } from '../../../../components/SearchInput';
import SortControl from '../../../../componentsNew/SortControl';
import { useOnClickOutside } from '../../../../utils';
import Button from '../../../../components/Button';
import { useBorrowNft } from '../BorrowManual';
import styles from './SortNfts.module.scss';
import {
  FilterFormInputsNames,
  SORT_VALUES,
  useBorrowPageFilter,
} from '../../hooks/useBorrowPageFilter';
import FiltersDropdown, {
  useFiltersModal,
} from '../../../../componentsNew/FiltersDropdown';

interface SortNftsProps {
  searchQuery: any;
  setSearch: any;
  selectedNfts: any;
}

const SortNfts: FC<SortNftsProps> = ({
  searchQuery,
  setSearch,
  selectedNfts,
}) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const { sort, setValue, control } = useBorrowPageFilter();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

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
              className={styles.filtersDropdown}
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
