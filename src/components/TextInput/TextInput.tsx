import classNames from 'classnames';
import { FC } from 'react';

import styles from './TextInput.module.scss';

interface TextInputProps {
  className?: string;
  wrapperClassName?: string;
  defaultValue?: string;
  onChange?: (nextValue: string) => void;
  placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({
  className,
  wrapperClassName,
  defaultValue,
  onChange,
  placeholder,
}) => {
  return (
    <div className={classNames(wrapperClassName)}>
      <input
        className={classNames(styles.input, className)}
        defaultValue={defaultValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
