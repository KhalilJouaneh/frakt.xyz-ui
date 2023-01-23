import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import FilterCollections from '@frakt/components/FilterCollections';
import SortControl from '@frakt/components/SortControl';
import { useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import { Loan } from '@frakt/api/loans';

import styles from './LoansPageContent.module.scss';
import { LoansList } from '../LoansList';
import {
  FilterFormInputsNames,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';

interface LoansPageContentProps {
  loans: Loan[];
  isLoading: boolean;
}

export const LoansPageContent: FC<LoansPageContentProps> = ({
  loans,
  isLoading,
}) => {
  const { connected } = useWallet();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const {
    control,
    loans: filteredLoans,
    sortValueOption,
    sort,
    setValue,
  } = useLoansFiltering({
    selectedCollections,
    loans,
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
          <div className={styles.sortWrapper} ref={ref}>
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
          <LoansList loans={filteredLoans} isLoading={isLoading} />
        </>
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </div>
  );
};
