import ReactSelect from 'react-select';
import { find, propEq } from 'ramda';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { FC } from 'react';

export interface SelectOptions {
  label: string;
  value: string;
  disabled?: boolean;
  event?: string;
}

interface SelectProps {
  options: SelectOptions[];
  className?: string;
  onChange?: (value: any) => void;
  value?: any;
  disabled?: boolean;
  name?: string;
  defaultValue?: SelectOptions;
}

export const Select: FC<SelectProps> = ({
  className = '',
  disabled,
  defaultValue,
  value,
  options,
  ...props
}) => {
  const ValueContainer = (valueContainerProps: any) => {
    const label = find(propEq('value', value))(options) as SelectOptions;

    return (
      <span className={styles.valueContainer}>
        <span>{label?.label}</span>
        <div className={styles.input}>{valueContainerProps.children[1]}</div>
      </span>
    );
  };

  return (
    <ReactSelect
      {...props}
      value={options.filter((option) => option.value === value)}
      isSearchable={false}
      components={{ ValueContainer }}
      className={classNames(styles.select, className)}
      isDisabled={disabled}
      classNamePrefix="custom-select"
      defaultValue={defaultValue}
      options={options}
    />
  );
};
