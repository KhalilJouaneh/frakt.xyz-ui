import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import FilterCollections from '@frakt/components/FilterCollections';
import SortControl from '@frakt/components/SortControl';
import { useOnClickOutside } from '@frakt/hooks';
import styles from './MyLoansList.module.scss';
import Button from '@frakt/components/Button';
import { LoansList } from '../LoansList';
import {
  FilterFormInputsNames,
  SORT_VALUES,
  useLoansFiltering,
} from '../../hooks/useLoansFiltering';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/components/FiltersDropdown';
import { useSelectableNftsState } from '../../hooks';

export const MyLoansList: FC = () => {
  const { connected } = useWallet();
  const { selectedNfts } = useSelectableNftsState();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const { control, loans, sortValueOption, sort, setValue } = useLoansFiltering(
    {
      selectedCollections,
    },
  );

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
                <div ref={ref}>
                  <div
                    className={cx(styles.filters, {
                      [styles.filtersActive]: !!selectedNfts.length,
                    })}
                  >
                    <Button type="tertiary" onClick={toggleFiltersModal}>
                      Filters
                    </Button>
                    {filtersModalVisible && (
                      <FiltersDropdown
                        onCancel={closeFiltersModal}
                        className={cx(styles.filtersDropdown, {
                          [styles.filtersDropdownActive]: !!selectedNfts.length,
                        })}
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
