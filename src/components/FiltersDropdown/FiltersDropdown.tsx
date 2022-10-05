import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styles from './FiltersDropdown.module.scss';

interface FiltersDropdownProps {
  children: ReactNode;
  className?: string;
}

const FiltersDropdown: FC<FiltersDropdownProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}></div>
      {children}
    </div>
  );
};

export default FiltersDropdown;
