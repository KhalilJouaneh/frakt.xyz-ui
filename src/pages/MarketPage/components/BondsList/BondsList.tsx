import { FC, useMemo, useState } from 'react';

import { useFiltersModal } from '@frakt/components/FiltersDropdown';
import { SearchInput } from '@frakt/components/SearchInput';
import { Bond, Market, Pair } from '@frakt/api/bonds';
import Button from '@frakt/components/Button';
import { useDebounce } from '@frakt/hooks';

import { BondsTable } from './components/BondsTable';
import styles from './BondsList.module.scss';

interface BondsListProps {
  market: Market;
  bonds: Bond[];
  pairs: Pair[];
  onExit: ({ bond, pair }: { bond: Bond; pair: Pair }) => void;
  onRedeem: (bond: Bond) => void;
}

export const BondsList: FC<BondsListProps> = ({
  market,
  bonds,
  pairs,
  onRedeem,
  onExit,
}) => {
  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const data = useMemo(() => {
    if (!searchString) return bonds;
    return bonds.filter((dataElement: any) => {
      const nftName = dataElement.collateralBox.nft.name;
      return nftName ? nftName.toUpperCase().includes(searchString) : false;
    });
  }, [searchString, bonds]);

  const {
    visible: sortModalMobileVisible,
    close: closeModalMobile,
    toggle: toggleModalMobile,
  } = useFiltersModal();

  return (
    <div className={styles.bondList}>
      <div className={styles.sortWrapper}>
        <SearchInput
          type="input"
          onChange={(event) => searchDebounced(event.target.value)}
          className={styles.searchInput}
          placeholder="Search by name"
        />
        <Button type="tertiary" onClick={toggleModalMobile}>
          Sorting
        </Button>
      </div>
      <BondsTable
        data={data}
        market={market}
        pairs={pairs}
        onRedeem={onRedeem}
        onExit={onExit}
        sortModalMobileVisible={sortModalMobileVisible}
        closeModalMobile={closeModalMobile}
        mobileBreakpoint={1380}
      />
    </div>
  );
};
