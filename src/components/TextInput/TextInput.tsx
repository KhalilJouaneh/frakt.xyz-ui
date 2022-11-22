import classNames from 'classnames';
import { FC } from 'react';

import styles from './TextInput.module.scss';

interface TextInputProps {
  label?: string;
  className?: string;
  wrapperClassName?: string;
  defaultValue?: string;
  onChange?: (nextValue: string) => void;
  placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({
  label,
  className,
  wrapperClassName,
  defaultValue,
  onChange,
  placeholder,
}) => {
  return (
    <div className={classNames(wrapperClassName)}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={classNames(styles.input, className)}
        defaultValue={defaultValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
