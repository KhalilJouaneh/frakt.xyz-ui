import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import Button from '../../../../components/Button';
import { Controller } from 'react-hook-form';
import { CollectionDropdown } from '../../../../components/CollectionDropdown';
import FiltersDropdown from '../../../../components/FiltersDropdown';
import SortOrderButton from '../../../../components/SortOrderButton';
import Toggle from '../../../../components/Toggle';
import { LoansList } from '../../../WalletPage/components/LoansList';
import { Select } from '../../../../components/Select';
import {
  FilterFormInputsNames,
  LoansValue,
  SORT_LOANS_TYPE_VALUES,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';
import styles from './MyLoansList.module.scss';
import { selectTotalDebt } from '../../../../state/loans/selectors';

export const MyLoansList: FC = () => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<LoansValue[]>(
    [],
  );

  const totalDebt = useSelector(selectTotalDebt);

  const { control, loans, totalBorrowed, sortValueOption, sort, setValue } =
    useLoansFiltering({
      selectedCollections,
    });
  const [filtersDropdownVisible, setFiltersDropdownVisible] =
    useState<boolean>(false);

  return (
    <div>
      {connected ? (
        <>
          <div className={styles.sortWrapper}>
            <div className={styles.container}>
              <div className={styles.content}>
                <div className={styles.valuesWrapper}>
                  <div className={styles.value}>
                    <div className={styles.valueTitle}>Total borrowed:</div>
                    <div className={styles.valueInfo}>
                      {totalBorrowed.toFixed(2)} SOL
                    </div>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.valueTitle}>Total Debt:</div>
                    <div className={styles.valueInfo}>
                      {totalDebt.toFixed(2)} SOL
                    </div>
                  </div>
                </div>
                <div className={styles.filters}>
                  <Button
                    type="tertiary"
                    onClick={() =>
                      setFiltersDropdownVisible(!filtersDropdownVisible)
                    }
                  >
                    Filters
                  </Button>
                  {filtersDropdownVisible && (
                    <FiltersDropdown
                      onCancel={() => setFiltersDropdownVisible(false)}
                      className={styles.filtersDropdown}
                    >
                      <div className={styles.controllers}>
                        <Controller
                          control={control}
                          name={FilterFormInputsNames.SORT}
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
                      </div>
                    </FiltersDropdown>
                  )}
                </div>
              </div>
            </div>

            {/* <div className={styles.filters}>
              <div className={styles.filtersContent}>
                <Controller
                  control={control}
                  name={FilterFormInputsNames.LOANS_STATUS}
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      valueContainerClassName={styles.sortingSelectContainer}
                      className={styles.sortingSelect}
                      label="Loan Type"
                      name={FilterFormInputsNames.LOANS_STATUS}
                      options={SORT_LOANS_TYPE_VALUES}
                      {...field}
                    />
                  )}
                />
                <CollectionDropdown
                  options={sortValueOption}
                  values={selectedCollections}
                  setValues={(value) => setSelectedCollections(value)}
                  className={styles.sortingSelect}
                />
              </div>
              <Controller
                control={control}
                name={FilterFormInputsNames.SORT}
                render={({ field: { ref, ...field } }) => (
                  <Select
                    valueContainerClassName={styles.sortingSelectContainer}
                    className={styles.sortingSelect}
                    label="Sort by"
                    name={FilterFormInputsNames.SORT}
                    options={SORT_VALUES}
                    {...field}
                  />
                )}
              />
            </div> */}
          </div>
          <LoansList loans={loans} />
        </>
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
