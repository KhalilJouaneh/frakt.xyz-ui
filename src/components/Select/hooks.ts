import { useState } from 'react';
import { find, propEq } from 'ramda';

import { SelectOptions } from './Select';

type UseSelect = (props: {
  options: SelectOptions[];
  defaultValue?: string;
}) => {
  options: SelectOptions[];
  activeTab: SelectOptions | null;
  value: string;
  setValue: (value: string) => void;
};

export const useSelect: UseSelect = ({ options, defaultValue }) => {
  const [value, setValue] = useState<string>(defaultValue);

  const activeTab =
    (find(propEq('value', value))(options) as SelectOptions) || null;

  return {
    options,
    activeTab,
    value,
    setValue,
  };
};
