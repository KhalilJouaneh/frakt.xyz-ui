import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Bond } from '@frakt/api/bonds';
import { compareNumbers } from '@frakt/utils';

export type Option = {
  value: string;
  label: string;
  tooltip?: string;
};

enum FilterControlNames {
  SORT = 'sort',
}

enum SortField {
  NAME = 'name',
  SIZE = 'size',
  APY = 'apy',
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

type UseSortableBondList = ({ bonds }: { bonds: Bond[] }) => {
  control: any;
  filteredBonds: Bond[];
  setValue: any;
  fieldValue: string;
  orderState: string;
  onChangeSortOrder: any;
};

export const useSortableBondList: UseSortableBondList = ({ bonds }) => {
  const { control, watch, setValue } = useForm({
    defaultValues: { [FilterControlNames.SORT]: SORT_OPTIONS[0] },
  });

  const sort = watch(FilterControlNames.SORT);
  const [sortOrder, setOrderState] = useState<string>(SORT_ORDER.ASC);

  // TODO rewrite this bullshit
  const onChangeSortOrder = () => {
    if (sortOrder === SORT_ORDER.ASC) {
      setOrderState(SORT_ORDER.DESC);
    } else if (sortOrder === SORT_ORDER.DESC) {
      setOrderState(SORT_ORDER.ASC);
    } else {
      setOrderState(SORT_ORDER.ASC);
    }
  };

  const { sortedBonds } = useSortingBonds({
    sortOrder,
    sortField: sort.value,
    bonds,
  });

  return {
    control,
    filteredBonds: sortedBonds,
    setValue,
    fieldValue: sort.value,
    orderState: sortOrder,
    onChangeSortOrder,
  };
};

const useSortingBonds = ({ sortOrder, sortField, bonds }) => {
  const sortedBonds = useMemo(() => {
    if (bonds?.length) {
      return bonds.sort((bondA, bondB) => {
        if (sortField === SortField.NAME) {
          const bondNameA = bondA.collateralBox.nft.name;
          const bondNameB = bondB.collateralBox.nft.name;

          if (sortOrder === SORT_ORDER.ASC)
            return bondNameA.localeCompare(bondNameB);
          return bondNameB.localeCompare(bondNameA);
        }
        if (sortField === SortField.SIZE) {
          return compareNumbers(
            bondA.amountOfUserBonds,
            bondB.amountOfUserBonds,
            sortOrder === SORT_ORDER.DESC,
          );
        }
        if (sortField === SortField.APY) {
          return compareNumbers(
            bondA.apy,
            bondB.apy,
            sortOrder === SORT_ORDER.DESC,
          );
        }
        return 0;
      });
    }
    return [];
  }, [bonds, sortOrder, sortField]);

  return { sortedBonds };
};

export const SORT_OPTIONS = [
  {
    value: 'name',
    label: 'Collateral name',
  },
  {
    value: 'size',
    label: 'Size',
    tooltip:
      'Amount of SOL you want to lend for a specific collection at the chosen LTV & APY',
  },
  {
    value: 'interest',
    label: 'Interest',
    tooltip: 'Interest (in %) for the duration of this loan',
  },
  {
    value: 'expiration',
    label: 'Expiration',
    tooltip: 'When the loan is paid back or liquidated',
  },
  {
    value: 'profit',
    label: 'Est. Profit',
    tooltip: 'Analyzed profit from repaying the loan',
  },
  {
    value: 'pnl',
    label: 'PNL',
    tooltip:
      'Gain/loss if you decide to sell your bond tokens (instantly) to other lenders (“exit”)',
  },
];
