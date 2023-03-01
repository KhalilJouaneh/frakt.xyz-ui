import Button from '@frakt/components/Button';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './MyDeposit.module.scss';

export const NavigationButtonJSX = ({
  path,
  label,
  disabled,
}: {
  path: string;
  label: string;
  disabled?: boolean;
}) => {
  return (
    <NavLink
      className={disabled && styles.disabledLink}
      style={{ width: '100%' }}
      to={path}
    >
      <Button disabled={disabled} className={styles.btn} type="secondary">
        {label}
      </Button>
    </NavLink>
  );
};

export const NoConnectedJSX = ({ values, className = '' }) => (
  <div className={styles.notConnetedWrapper}>
    {values.map(({ value, label }, idx: number) => (
      <div
        key={idx}
        className={classNames(styles.notConntectedContent, className)}
      >
        <span className={styles.notConnectedLabel}>{label}</span>
        <span className={styles.notConnectedValue}>{value}</span>
      </div>
    ))}
  </div>
);

export const BadgeJSX = ({ label }: { label: string }) => (
  <div className={styles.badge}>{label}</div>
);
