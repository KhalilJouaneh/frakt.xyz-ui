import { FC, useMemo, useRef, useState } from 'react';

import { Bond, Market, Pair } from '@frakt/api/bonds';

import { BondsTable } from './components/BondsTable';
import styles from './BondsList.module.scss';
import { SearchInput } from '@frakt/components/SearchInput';
import { useDebounce, useOnClickOutside } from '@frakt/hooks';
import Button from '@frakt/components/Button';
import { useFiltersModal } from '@frakt/components/FiltersDropdown';

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

  const ref = useRef();
  useOnClickOutside(ref, closeModalMobile);

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
        mobileBreakpoint={1380}
      />
    </div>
  );
};
