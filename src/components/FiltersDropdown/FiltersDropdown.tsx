import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { CloseModal } from '@frakt/icons';
import styles from './FiltersDropdown.module.scss';

interface FiltersDropdownProps {
  children: ReactNode;
  className?: string;
  onCancel?: () => void;
}

const FiltersDropdown: FC<FiltersDropdownProps> = ({
  children,
  className,
  onCancel,
}) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.header}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModal className={styles.closeIcon} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default FiltersDropdown;
