import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { FC, useRef, useState } from 'react';
import { web3 } from 'fbonds-core';

import styles from './MarketPage.module.scss';
import Button from '@frakt/components/Button';
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
import { NavLink, useParams } from 'react-router-dom';
import { useOnClickOutside } from '@frakt/hooks';
import { useMarket } from './hooks';
import { PATHS } from '@frakt/constants';
import { Loader } from '@frakt/components/Loader';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const collectionsMock = [
  { value: 'Frakt' },
  { value: 'Pawnshop gnomies' },
  { value: 'Solpunks' },
];

const MarketPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const {
    control,
    sort,
    /*setSearch, pools,*/ setValue,
    showStakedOnlyToggle,
  } = useLendingPoolsFiltering();
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  const { market, isLoading } = useMarket({
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  return (
    <AppLayout>
      {isLoading && <Loader size="large" />}
      {!!market && (
        <div className={styles.bondPage}>
          <>
            <div className={styles.wrapper}>
              <div>
                <NavLink to={PATHS.BONDS} className={styles.btnBack}>
                  <Arrow />
                </NavLink>
              </div>

              <div className={styles.bondMarket}>
                <div className={styles.bondMarketInfo}>
                  <img src={market.image} className={styles.image} />
                  <div className={styles.title}>{market.name}</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoItemBalance}>
                      <div className={styles.infoName}>BALANCE</div>
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
          </>
          <OrderBook marketPubkey={marketPubkey} />
        </div>
      )}
    </AppLayout>
  );
};

export default MarketPage;
