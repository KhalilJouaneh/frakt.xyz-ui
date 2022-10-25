import { FC } from 'react';
import cx from 'classnames';

import styles from './Select.module.scss';

export interface SelectOptions {
  label: string;
  value: string;
  disabled?: boolean;
  event?: string;
}

export interface SelectProps {
  options: SelectOptions[];
  value: string;
  setValue: any;
  className?: string;
}

const Select: FC<SelectProps> = ({
  options,
  value: selectValue,
  setValue,
  className,
}) => {
  return (
    <select className={cx(styles.select, className)} onChange={setValue}>
      {options.map(({ label, value, disabled }) => (
        <option
          key={value}
          disabled={disabled}
          selected={selectValue === value}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
