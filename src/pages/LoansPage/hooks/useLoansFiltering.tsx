import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { uniqBy, prop, sum, map } from 'ramda';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { selectLoanNfts } from '../../../state/loans/selectors';
import { caclTimeToRepay } from '../../../utils/loans';
import { Loan } from '../../../state/loans/types';
import { compareNumbers } from '../../../utils';

type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: LoansValue;
};

export type LoansValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

enum SortField {
  DEBT = 'debt',
  TIME_TO_REPAY = 'timeToRepay',
  HEALTH = 'health',
  CREATION = 'creation',
}

type UseLoansFiltering = ({
  selectedCollections,
}: {
  selectedCollections: string[];
}) => {
  control: Control<FilterFormFieldsValues>;
  loans: Loan[];
  totalBorrowed: number;
  sortValueOption: LoansValue[];
  sort: LoansValue;
  setValue: any;
};

export const useLoansFiltering: UseLoansFiltering = ({
  selectedCollections,
}) => {
  const { connected } = useWallet();
  const userLoans: Loan[] = useSelector(selectLoanNfts);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: {
        label: <span>Time to repay</span>,
        value: 'timeToRepay_asc',
      },
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const selectedCollectionsName = selectedCollections.map((value) => value);

  const uniqCollections = uniqBy(prop('collectionName'), userLoans);

  const sortValueOption = uniqCollections.map(({ collectionName }) => {
    return [
      {
        label: <span>{collectionName}</span>,
        value: collectionName,
      },
    ][0];
  });

  const filteredLoans = useMemo(() => {
    if (userLoans?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return userLoans
        .filter((loan) => {
          const nftName = loan.name;
          const collectionName = loan.collectionName;

          const selectedCollections =
            selectedCollectionsName.includes(collectionName);

          const showSelectedCollection = selectedCollectionsName.length
            ? !selectedCollections
            : false;

          if (showSelectedCollection) return false;

          return nftName;
        })
        .sort((loanA, loanB) => {
          if (sortField === SortField.DEBT) {
            return compareNumbers(
              loanA.repayValue,
              loanB.repayValue,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.TIME_TO_REPAY) {
            if (loanA.isPriceBased) return;

            const { expiredAtUnix: timeToRepayA } = caclTimeToRepay(loanA);

            const { expiredAtUnix: timeToRepayB } = caclTimeToRepay(loanB);

            return compareNumbers(
              timeToRepayA,
              timeToRepayB,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.HEALTH) {
            if (!loanA.isPriceBased) return;

            return compareNumbers(
              loanA.health,
              loanB.health,
              sortOrder === 'asc',
            );
          }

          if (sortField === SortField.CREATION) {
            const creationTimeA = moment(loanA.startedAt).unix();
            const creationTimeB = moment(loanB.startedAt).unix();

            return compareNumbers(
              creationTimeA,
              creationTimeB,
              sortOrder === 'asc',
            );
          }
          return 0;
        });
    }
    return [];
  }, [userLoans, sort, selectedCollectionsName]);

  const totalBorrowed = sum(map(({ loanValue }) => loanValue, filteredLoans));

  return {
    control,
    loans: filteredLoans,
    showStakedOnlyToggle: connected,
    totalBorrowed,
    sortValueOption,
    sort,
    setValue,
  };
};

export const SORT_VALUES = [
  {
    label: <span>Creation</span>,
    value: 'creation_',
  },
  {
    label: <span>Debt</span>,
    value: 'debt_',
  },
  {
    label: <span>Time to repay</span>,
    value: 'timeToRepay_',
  },
  {
    label: <span>Health</span>,
    value: 'health_',
  },
];
