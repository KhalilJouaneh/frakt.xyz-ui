import classNames from 'classnames/bind';
import { Done } from '@frakt/icons';
import styles from './styles.module.scss';

export const VerifiedBadge = (): JSX.Element => (
  <div
    className={classNames(
      styles.label,
      styles.labelStrict,
      styles.labelVerified,
    )}
  >
    <Done /> <span>Verified</span>
  </div>
);
