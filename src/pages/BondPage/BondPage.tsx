import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { FC, useRef, useState } from 'react';
import mockImg from './mockImg.jpg';

import styles from './BondPage.module.scss';
import Button from '@frakt/components/Button';
import { ArrowLeftIcon } from '@frakt/icons/ArrowLeftIcon';
import { useLendingPoolsFiltering } from '../LendPage/hooks/useLendingPoolsFiltering';
import FiltersDropdown, {
  useFiltersModal,
} from '@frakt/componentsNew/FiltersDropdown';
import FilterCollections from '@frakt/componentsNew/FilterCollections';
import SortControl from '@frakt/componentsNew/SortControl';
import { Controller } from 'react-hook-form';
import Toggle from '@frakt/components/Toggle';
import { SORT_VALUES } from '../BorrowPage';
import { SearchInput } from '@frakt/components/SearchInput';
import Bond from './components/Bond/Bond';
import OrderBook from './components/OrderBook/OrderBook';
import { Arrow } from '@frakt/iconsNew/Arrow';
import RoundButton from '@frakt/components/RoundButton/RoundButton';
import { PATHS } from '@frakt/constants';
import { useHistory } from 'react-router-dom';
import { useOnClickOutside } from '@frakt/hooks';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const collectionsMock = [
  { value: 'Frakt' },
  { value: 'Pawnshop gnomies' },
  { value: 'Solpunks' },
];

const BondPage: FC = () => {
  const history = useHistory();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
    useLendingPoolsFiltering();
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const openCreatePool = () => {
    history.push(PATHS.POOLS_CREATION);
  };

  const goBack = () => {
    history.goBack();
  };

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);
  return (
    <AppLayout>
      <div className={styles.bondPage}>
        <div>
          <div className={styles.wrapper}>
            <div>
              <div onClick={goBack} className={styles.btnBack}>
                <Arrow />
              </div>
            </div>

            {/* <RoundButton icon={<Arrow />} /> */}

            <div className={styles.bondMarket}>
              <div className={styles.bondMarketInfo}>
                <img src={mockImg} className={styles.image} />
                <div className={styles.title}>Solana Monkey Business</div>
              </div>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <div>
                    <div className={styles.infoName}>TOTAL SIZE</div>
                    <div className={styles.infoValue}>4,356,456.7 fndSMB</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div>
                    <div className={styles.infoName}>REWARDS</div>
                    <div className={styles.infoValue}>345 SOL</div>
                  </div>
                  <Button className={styles.btn} type="primary">
                    Redeem
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sortWrapper}>
            <SearchInput
              className={styles.searchInput}
              placeholder="Search by name"
            />
            <div ref={ref}>
              <div className={styles.filtersWrapper}>
                <Button type="tertiary" onClick={toggleFiltersModal}>
                  Filters
                </Button>

                {filtersModalVisible && (
                  <FiltersDropdown
                    onCancel={closeFiltersModal}
                    className={styles.filtersDropdown}
                  >
                    <div>
                      {showStakedOnlyToggle && (
                        <Controller
                          control={control}
                          name={InputControlsNames.SHOW_STAKED}
                          render={({ field: { ref, ...field } }) => (
                            <Toggle
                              label="My bag only"
                              className={styles.toggle}
                              name={InputControlsNames.SHOW_STAKED}
                              {...field}
                            />
                          )}
                        />
                      )}
                      <FilterCollections
                        options={collectionsMock}
                        selectedCollections={selectedCollections}
                        setSelectedCollections={setSelectedCollections}
                      />
                      <SortControl
                        control={control}
                        name={InputControlsNames.SORT}
                        options={SORT_VALUES}
                        sort={sort}
                        setValue={setValue}
                      />
                    </div>
                  </FiltersDropdown>
                )}
              </div>
            </div>
          </div>

          <div className={styles.bondList}>
            <Bond />
            <Bond />
            <Bond />
            <Bond />
            <Bond />
          </div>
        </div>
        <OrderBook onClick={openCreatePool} />
      </div>
    </AppLayout>
  );
};

export default BondPage;
