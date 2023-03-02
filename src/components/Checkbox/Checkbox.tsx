import { FC } from 'react';
import classNames from 'classnames';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  onChange: () => void;
  checked: boolean;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  onChange,
  checked,
  className,
}) => {
  return (
    <div className={classNames(styles.checkbox, className)}>
      <label>
        <input onChange={onChange} type="checkbox" checked={checked} />
        <p>{label}</p>
        <span className={styles.checkboxInput}></span>
      </label>
    </div>
  );
};

export default Checkbox;
