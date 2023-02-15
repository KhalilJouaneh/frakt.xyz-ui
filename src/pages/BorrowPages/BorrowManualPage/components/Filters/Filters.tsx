import { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { SearchInput } from '@frakt/components/SearchInput';
import Button from '@frakt/components/Button';
import { useOnClickOutside } from '@frakt/hooks';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import SortControl from '@frakt/components/SortControl';

import styles from './Filters.module.scss';

interface FiltersProps {
  setSearch: (searchQuery: string) => void;
  onSortChange: (value: { name: SortName; order: SortOrder }) => void;
}

export const Filters: FC<FiltersProps> = ({ setSearch, onSortChange }) => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: defaultSortValue,
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  return (
    <div className={styles.sortWrapper}>
      <SearchInput
        type="input"
        onChange={(event) => setSearch(event.target.value)}
        className={styles.searchInput}
        placeholder="Search by name"
      />
      <div className={styles.filters} ref={ref}>
        <Button type="tertiary" onClick={toggleFiltersModal}>
          Sorting
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
              setValue={(_: string, sortValue: SortValue) => {
                const [name, order] = sortValue.value.split('_');
                onSortChange({
                  name: name as SortName,
                  order: order as SortOrder,
                });
                setValue(FilterFormInputsNames.SORT, sortValue);
              }}
            />
          </FiltersDropdown>
        )}
      </div>
    </div>
  );
};

type SortOrder = 'desc' | 'asc';
type SortName = 'maxLoanValue' | 'name';

enum FilterFormInputsNames {
  SORT = 'sort',
}

const SORT_VALUES: Array<SortValue> = [
  {
    label: <span>Loan value</span>,
    value: 'maxLoanValue_',
  },
  {
    label: <span>Name</span>,
    value: 'name_',
  },
];

const defaultSortValue = {
  label: <span>Loan value</span>,
  value: 'maxLoanValue_desc',
};

type SortValue = {
  label: JSX.Element;
  value: string;
};
