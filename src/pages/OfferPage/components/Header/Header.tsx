import { FC } from 'react';
import cx from 'classnames';

import { Arrow } from '@frakt/icons';
import styles from './Header.module.scss';

interface HeaderProps {
  onBackBtnClick?: () => void;
  title: string;
  subtitle?: string;
  className?: string;
}

export const Header: FC<HeaderProps> = ({
  onBackBtnClick,
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={styles.wrapper}>
      {onBackBtnClick && (
        <div onClick={onBackBtnClick} className={styles.btnBack}>
          <Arrow />
        </div>
      )}
      <div className={cx(styles.header, className)}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.subtitle}>{subtitle}</h2>
        </div>
      </div>
    </div>
  );
};
