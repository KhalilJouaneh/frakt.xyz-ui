import { useState } from 'react';
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

  return {
    options,
    activeTab:
      options.find(({ value: SelectValue }) => value === SelectValue) || null,
    value,
    setValue,
  };
};
