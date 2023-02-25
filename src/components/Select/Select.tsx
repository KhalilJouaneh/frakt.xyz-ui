import ReactSelect, { ValueContainerProps } from 'react-select';
import classNames from 'classnames';

import styles from './styles.module.scss';

export interface SelectOption<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  className?: string;
  onChange?: (value: any) => void;
  value?: SelectOption<T>;
  disabled?: boolean;
  name?: string;
  defaultValue?: SelectOption<T>;
}

export const Select = <T extends unknown>({
  className = '',
  disabled,
  defaultValue,
  value,
  options,
  ...props
}: SelectProps<T>) => {
  const ValueContainer = (props: ValueContainerProps<SelectOption<T>>) => {
    const option = options.find((o) => o.label === value.label);

    return (
      <span className={styles.valueContainer}>
        <span>{option?.label}</span>
        <div className={styles.input}>{props.children[1]}</div>
      </span>
    );
  };

  return (
    <ReactSelect
      {...props}
      value={value}
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
