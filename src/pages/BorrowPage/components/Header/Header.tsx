import { FC } from 'react';
import cx from 'classnames';

import styles from './Header.module.scss';
import Icons from '../../../../iconsNew';

interface HeaderProps {
  onClick?: () => void;
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({ onClick, title, subtitle, className }) => {
  return (
    <>
      {onClick && (
        <div onClick={onClick} className={styles.btnBack}>
          <Icons.Arrow />
        </div>
      )}
      <div className={cx(styles.header, className)}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.subtitle}>{subtitle}</h2>
        </div>
      </div>
    </>
  );
};

export default Header;
