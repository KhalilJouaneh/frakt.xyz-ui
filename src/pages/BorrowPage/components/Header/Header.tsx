import { FC } from 'react';
import cx from 'classnames';

import styles from './Header.module.scss';
import { Arrow } from '@frakt/icons';

interface HeaderProps {
  onClick?: () => void;
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({ onClick, title, subtitle, className }) => {
  return (
    <div className={styles.wrapper}>
      {onClick && (
        <div>
          <div onClick={onClick} className={styles.btnBack}>
            <Arrow />
          </div>
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

export default Header;
