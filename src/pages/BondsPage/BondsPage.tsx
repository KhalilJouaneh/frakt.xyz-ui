import { FC, useRef } from 'react';

import { useOnClickOutside } from '@frakt/hooks';
import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import Header from '../BorrowPage/components/Header';
import Button from '../../components/Button';
import FiltersDropdown, {
  useFiltersModal,
} from '../../componentsNew/FiltersDropdown';
import styles from './BondsPage.module.scss';
import BondsPoolPage from '../BondsPoolPage';

const BondsPage: FC = () => {
  const {
    visible: filtersModalVisible,
    close: closeFiltersModal,
    toggle: toggleFiltersModal,
  } = useFiltersModal();

  const ref = useRef();
  useOnClickOutside(ref, closeFiltersModal);

  return (
    <AppLayout>
      <Header title="Bonds" subtitle="description" />
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
                <div></div>
              </FiltersDropdown>
            )}
          </div>
        </div>
      </div>
      <div className={styles.pools}>
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
        <BondsPoolPage />
      </div>
    </AppLayout>
  );
};

export default BondsPage;
