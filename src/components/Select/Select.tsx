import ReactSelect from 'react-select';
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
}

export const Select: FC<SelectProps> = ({
  className = '',
  disabled,
  ...props
}) => {
  const ValueContainer = (valueContainerProps: any) => {
    const label = valueContainerProps.getValue()?.[0]?.label;

    return (
      <span className={styles.valueContainer}>
        <span className={styles.value}>{label}</span>
        <div className={styles.input}>{valueContainerProps.children[1]}</div>
      </span>
    );
  };

  return (
    <ReactSelect
      {...props}
      isSearchable={false}
      components={{ ValueContainer }}
      className={classNames(styles.select, className)}
      isDisabled={disabled}
      classNamePrefix="custom-select"
    />
  );
};
