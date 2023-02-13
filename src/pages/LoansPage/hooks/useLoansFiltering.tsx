import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { uniqBy } from 'lodash';
import moment from 'moment';

import { Loan, LoanType } from '@frakt/api/loans';

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
  loans,
}: {
  selectedCollections: string[];
  loans: Loan[];
}) => {
  control: Control<FilterFormFieldsValues>;
  loans: Loan[];
  sortValueOption: LoansValue[];
  sort: LoansValue;
  setValue: any;
};

export const useLoansFiltering: UseLoansFiltering = ({
  selectedCollections,
  loans,
}) => {
  const { connected } = useWallet();

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

  const uniqCollections = uniqBy(loans, ({ nft }) => nft.collectionName);

  const sortValueOption = uniqCollections.map(({ nft }) => {
    return [
      {
        label: <span>{nft.collectionName}</span>,
        value: nft.collectionName,
      },
    ][0];
  });

  const filteredLoans = useMemo(() => {
    if (loans?.length) {
      const [sortField, sortOrder] = sort.value.split('_');

      return loans
        .filter(({ nft }) => {
          const nftName = nft.name;
          const collectionName = nft.collectionName;

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
              sortOrder === 'desc',
            );
          }

          if (sortField === SortField.TIME_TO_REPAY) {
            if (loanA.loanType === LoanType.PRICE_BASED) return 1;
            if (loanB.loanType === LoanType.PRICE_BASED) return -1;

            const timeToRepayA =
              loanA?.classicParams?.timeBased?.expiredAt ||
              loanA?.bondParams?.expiredAt;

            const timeToRepayB =
              loanB?.classicParams?.timeBased?.expiredAt ||
              loanB?.bondParams?.expiredAt;

            return compareNumbers(
              timeToRepayA,
              timeToRepayB,
              sortOrder === 'desc',
            );
          }

          if (sortField === SortField.HEALTH) {
            if (loanA.loanType !== LoanType.PRICE_BASED) return 1;
            if (loanA.loanType !== LoanType.PRICE_BASED) return -1;

            return compareNumbers(
              loanA.classicParams.priceBased.health,
              loanB.classicParams.priceBased.health,
              sortOrder === 'desc',
            );
          }

          if (sortField === SortField.CREATION) {
            const creationTimeA = moment(loanA.startedAt).unix();
            const creationTimeB = moment(loanB.startedAt).unix();

            return compareNumbers(
              creationTimeA,
              creationTimeB,
              sortOrder === 'desc',
            );
          }
          return 0;
        });
    }
    return [];
  }, [loans, sort, selectedCollectionsName]);

  return {
    control,
    loans: filteredLoans,
    showStakedOnlyToggle: connected,
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
