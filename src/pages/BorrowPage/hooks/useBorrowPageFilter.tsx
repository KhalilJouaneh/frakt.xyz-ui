import { Control, useForm, UseFormSetValue } from 'react-hook-form';

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: SortValue;
};

export const FETCH_LIMIT = 10;

export const SORT_VALUES = [
  {
    label: <span>Name</span>,
    value: 'name_',
  },
  {
    label: <span>Loan value</span>,
    value: 'maxLoanValue_',
  },
];

export const defaultSortValues = {
  label: <span>Name</span>,
  value: 'name_asc',
};

export type SortValue = {
  label: JSX.Element;
  value: string;
};

type UseBorrowPageFilter = () => {
  control: Control<FilterFormFieldsValues>;
  sort: SortValue;
  setValue: UseFormSetValue<{ sort: SortValue }>;
};

export const useBorrowPageFilter: UseBorrowPageFilter = () => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: defaultSortValues,
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  return {
    control,
    sort: sort,
    setValue: setValue,
  };
};
