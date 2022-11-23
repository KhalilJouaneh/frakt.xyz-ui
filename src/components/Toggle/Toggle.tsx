import { FC } from 'react';
import cx from 'classnames';

import styles from './Toggle.module.scss';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: boolean) => void;
}

const Toggle: FC<ToggleProps> = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value,
  label = null,
  defaultChecked,
}) => {
  const isControlled = typeof value === 'boolean';

  return (
    <label
      className={cx(
        styles.root,
        { [styles.rootDisabled]: disabled },
        className,
      )}
    >
      <input
        type="checkbox"
        className={styles.input}
        defaultChecked={defaultChecked}
        checked={isControlled ? value : null}
        disabled={disabled}
        onChange={(event) => {
          onChange(isControlled ? !value : event.target.checked);
        }}
      />
      <span className={styles.slider} />
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export default Toggle;
