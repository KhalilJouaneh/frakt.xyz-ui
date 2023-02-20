import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';

import { useDebounce } from '@frakt/hooks';
import { Bond } from '@frakt/api/bonds';

type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: PoolsSortValue;
  [FilterFormInputsNames.SHOW_STAKED]: boolean;
};

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

type PoolsSortValue = {
  label: JSX.Element;
  value: string;
};

enum FilterFormInputsNames {
  SORT = 'sort',
  SHOW_STAKED = 'showStaked',
}

enum SortField {
  NAME = 'name',
  APR = 'apr',
  TOTAL_LIQUIDITY = 'totalLiquidity',
}

type UseBondsFiltering = (bonds: Bond[]) => {
  control: Control<FilterFormFieldsValues>;
  bonds: Bond[];
  setSearch: (value?: string) => void;
  showStakedOnlyToggle: boolean;
  setValue?: any;
  sort?: PoolsSortValue;
};

export const useBondsFiltering: UseBondsFiltering = (bonds) => {
  const { connected } = useWallet();

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SHOW_STAKED]: false,
      [FilterFormInputsNames.SORT]: {
        label: <span>APR</span>,
        value: 'totalLiquidity_desc',
      },
    },
  });

  const [searchString, setSearchString] = useState<string>('');

  const searchDebounced = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const sort = watch(FilterFormInputsNames.SORT);

  const showStaked = watch(FilterFormInputsNames.SHOW_STAKED);

  const filteredPools = useMemo(() => {
    if (bonds?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return bonds
        .filter((bond) => {
          const poolName = bond.collateralBox.nft.name;
          return poolName
            ? poolName.toUpperCase().includes(searchString)
            : false;
        })
        .sort((bondA, bondB) => {
          if (sortField === SortField.NAME) {
            const bondNameA = bondA.collateralBox.nft.name;
            const bondNameB = bondB.collateralBox.nft.name;

            if (sortOrder === SORT_ORDER.ASC)
              return bondNameA.localeCompare(bondNameB);
            return bondNameB.localeCompare(bondNameA);
          }
          return 0;
        });
    }

    return [];
  }, [bonds, sort, searchString, showStaked, setValue]);

  return {
    control,
    bonds: filteredPools,
    setSearch: searchDebounced,
    showStakedOnlyToggle: connected,
    setValue,
    sort,
  };
};
