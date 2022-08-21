import classNames from 'classnames';
import { FC } from 'react';
import { ArrowUp } from '../../icons';
import Button from '../Button';
import styles from './SortOrderButton.module.scss';

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

interface SortOrderButtonProps {
  value: string;
  setValue: any;
  label: JSX.Element;
  sort: { label: JSX.Element; value: string };
}

const SortOrderButton: FC<SortOrderButtonProps> = ({
  value,
  setValue,
  label,
  sort,
}) => {
  const ASC_SORT = value + SORT_ORDER.ASC;
  const DESC_SORT = value + SORT_ORDER.DESC;

  const isActiveASC = sort.value === ASC_SORT;
  const isActiveDESC = sort.value === DESC_SORT;

  return (
    <div className={styles.sortingBtn}>
      <Button
        type="tertiary"
        className={classNames(
          styles.filterBtn,
          isActiveASC && styles.filterBtnActive,
        )}
        onClick={() => setValue('sort', { label, value: ASC_SORT })}
      >
        asc <ArrowUp />
      </Button>
      <Button
        type="tertiary"
        className={classNames(
          styles.filterBtn,
          isActiveDESC && styles.filterBtnActive,
        )}
        onClick={() => setValue('sort', { label, value: DESC_SORT })}
      >
        dsc <ArrowUp className={styles.arrowDown} />
      </Button>
    </div>
  );
};

export default SortOrderButton;
