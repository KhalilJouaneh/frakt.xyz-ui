import { FC } from 'react';
import { Controller } from 'react-hook-form';

import SortOrderButton from '../../componentsNew/SortOrderButton';
import styles from './SortControl.module.scss';

interface SortControlProps {
  control: any;
  name: string;
  options: { label: JSX.Element; value: string }[];
  sort: any;
  setValue: any;
}

const SortControl: FC<SortControlProps> = ({
  control,
  name,
  options,
  setValue,
  sort,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div className={styles.sortingWrapper}>
          {options.map(({ label, value }, idx) => (
            <div className={styles.sorting} key={idx}>
              <SortOrderButton
                label={label}
                setValue={setValue}
                sort={sort}
                value={value}
              />
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default SortControl;
