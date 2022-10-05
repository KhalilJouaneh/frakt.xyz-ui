import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import FiltersDropdown from '../../../../components/FiltersDropdown';
import SortOrderButton from '../../../../components/SortOrderButton';
import { LoansList } from '../../../WalletPage/components/LoansList';
import { selectTotalDebt } from '../../../../state/loans/selectors';
import { useOnClickOutside } from '../../../../utils';
import { Radio } from '../../../../components/Radio';
import Button from '../../../../components/Button';
import styles from './MyLoansList.module.scss';
import {
  FilterFormInputsNames,
  LoansValue,
  SORT_LOANS_TYPE_VALUES,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';

export const MyLoansList: FC = () => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<LoansValue[]>(
    [],
  );

  const totalDebt = useSelector(selectTotalDebt);

  const {
    control,
    loans,
    totalBorrowed,
    showLoansStatus,
    sortValueOption,
    sort,
    setValue,
  } = useLoansFiltering({
    selectedCollections,
  });

  const [filtersDropdownVisible, setFiltersDropdownVisible] =
    useState<boolean>(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setFiltersDropdownVisible(false));

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
                <div ref={ref}>
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
                      <FiltersDropdown className={styles.filtersDropdown}>
                        <Controller
                          control={control}
                          name={FilterFormInputsNames.LOANS_STATUS}
                          render={() => (
                            <div className={styles.radioWrapper}>
                              {SORT_LOANS_TYPE_VALUES.map(
                                ({ label, value }, idx) => (
                                  <div className={styles.sorting} key={idx}>
                                    <Radio
                                      checked={showLoansStatus.value === value}
                                      label={label.props?.children}
                                      onClick={() =>
                                        setValue(
                                          FilterFormInputsNames.LOANS_STATUS,
                                          { label, value },
                                        )
                                      }
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          control={control}
                          name={FilterFormInputsNames.SORT}
                          render={() => (
                            <div className={styles.sortingWrapper}>
                              {SORT_VALUES.map(({ label, value }, idx) => (
                                <div className={styles.sorting} key={idx}>
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

                        <div className={styles.filters}>
                          <div className={styles.filtersContent}>
                            {/* <CollectionDropdown
                              options={sortValueOption}
                              values={selectedCollections}
                              setValues={(value) =>
                                setSelectedCollections(value)
                              }
                              className={styles.sortingSelect}
                            /> */}
                            {/* {sortValueOption.map((value, idx) => (
                              <div key={idx}>
                                <Checkbox
                                  className={styles.checkbox}
                                  onChange={() => {
                                    setSelectedCollections([value]);
                                  }}
                                  value={!!selectedCollections.filter(
                                    ({ value: rawValue }) => rawValue === value.value,
                                  )}
                                  label={value.label}
                                />
                              </div>
                            ))} */}
                          </div>
                        </div>
                      </FiltersDropdown>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LoansList loans={loans} />
        </>
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
