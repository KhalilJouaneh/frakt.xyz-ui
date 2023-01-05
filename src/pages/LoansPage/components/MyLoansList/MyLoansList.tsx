import { FC, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import FilterCollections from '@frakt/components/FilterCollections';
import { StatsValuesColumn } from '@frakt/components/StatsValues';
import { selectTotalDebt } from '@frakt/state/loans/selectors';
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
                <div
                  className={cx(styles.valuesWrapper, {
                    [styles.valuesWrapperActive]: !!selectedNfts.length,
                  })}
                >
                  <StatsValuesColumn
                    className={styles.values}
                    label={'Total borrowed:'}
                    icon={false}
                    textCenter
                  >
                    {totalBorrowed?.toFixed(2)} SOL
                  </StatsValuesColumn>
                  <StatsValuesColumn
                    className={styles.values}
                    label={'Total Debt:'}
                    icon={false}
                    textCenter
                  >
                    {totalDebt?.toFixed(2)} SOL
                  </StatsValuesColumn>
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
