import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import FiltersDropdown, {
  useFiltersModal,
} from '../../../../componentsNew/FiltersDropdown';
import { LoansList } from '../LoansList';
import { selectTotalDebt } from '../../../../state/loans/selectors';
import { useOnClickOutside } from '../../../../utils';
import Button from '../../../../components/Button';
import styles from './MyLoansList.module.scss';
import {
  FilterFormInputsNames,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';
import FilterCollections from '../../../../componentsNew/FilterCollections';
import SortControl from '../../../../componentsNew/SortControl';

export const MyLoansList: FC = () => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const totalDebt = useSelector(selectTotalDebt);

  const { control, loans, totalBorrowed, sortValueOption, sort, setValue } =
    useLoansFiltering({
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
                        <FilterCollections
                          setSelectedCollections={setSelectedCollections}
                          selectedCollections={selectedCollections}
                          options={sortValueOption}
                        />
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
