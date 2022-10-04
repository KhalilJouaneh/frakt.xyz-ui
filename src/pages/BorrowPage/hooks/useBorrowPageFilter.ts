import { Control, useForm } from 'react-hook-form';
import { SORT_VALUES } from '../BorrowPage.constants';

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: SortValue;
};

type SortValue = {
  label: JSX.Element;
  value: string;
};

type UseBorrowPageFilter = () => {
  control: Control<FilterFormFieldsValues>;
  sortValue: string;
};

export const useBorrowPageFilter: UseBorrowPageFilter = () => {
  const { control, watch } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);
  return {
    control,
    sortValue: sort.value,
  };
};
