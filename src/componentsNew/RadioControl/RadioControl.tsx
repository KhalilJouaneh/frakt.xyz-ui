import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { Radio } from '../../components/Radio';
import styles from './RadioControl.module.scss';

interface RadioControlProps {
  control: any;
  name: string;
  checkedValue: string;
  options: { label: JSX.Element; value: string }[];
  title?: string;
  setValue: any;
}

const RadioControl: FC<RadioControlProps> = ({
  control,
  options,
  checkedValue,
  title,
  name,
  setValue,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <>
          {title && <p className={styles.radioLabel}>Loan type</p>}
          <div className={styles.radioWrapper}>
            {options.map(({ label, value }, idx) => (
              <div className={styles.sorting} key={idx}>
                <Radio
                  checked={checkedValue === value}
                  label={label.props?.children}
                  onClick={() => setValue(name, { label, value })}
                />
              </div>
            ))}
          </div>
        </>
      )}
    />
  );
};

export default RadioControl;
