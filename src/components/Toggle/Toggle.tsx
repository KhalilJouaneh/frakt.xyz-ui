import { Switch } from 'antd';
import { FC } from 'react';
import cx from 'classnames';

import styles from './Toggle.module.scss';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

const Toggle: FC<ToggleProps> = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}) => (
  <div
    className={cx(styles.filterToggle, className)}
    onClick={() => onChange(!value)}
  >
    <Switch className={styles.toggle} checked={value} disabled={disabled} />
    {label && <p className={styles.filterToggle__text}>{label}</p>}
  </div>
);

export default Toggle;
