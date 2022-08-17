import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { CloseModalIcon } from '../../icons';
import styles from './FiltersDropdown.module.scss';

interface FiltersDropdownProps {
  onCancel?: () => void;
  children: ReactNode;
  className?: string;
}

const FiltersDropdown: FC<FiltersDropdownProps> = ({
  onCancel,
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <p className={styles.title}>Filters</p>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default FiltersDropdown;
