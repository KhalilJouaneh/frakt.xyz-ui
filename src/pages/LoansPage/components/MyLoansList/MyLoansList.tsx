import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import FiltersDropdown, {
  useFiltersModal,
} from '../../../../componentsNew/FiltersDropdown';
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
import FilterCollections from '../../../../componentsNew/FilterCollections';

export const MyLoansList: FC = () => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

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

  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

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
                    <Button type="tertiary" onClick={toggleFiltersModal}>
                      Filters
                    </Button>

                    {filtersModalVisible && (
                      <FiltersDropdown
                        onCancel={closeFiltersModal}
                        className={styles.filtersDropdown}
                      >
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
                        <FilterCollections
                          setSelectedCollections={setSelectedCollections}
                          selectedCollections={selectedCollections}
                          options={sortValueOption}
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
