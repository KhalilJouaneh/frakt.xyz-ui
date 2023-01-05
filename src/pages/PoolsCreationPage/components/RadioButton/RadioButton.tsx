import { ChangeEvent, FC } from 'react';

import styles from './RadioButton.module.scss';

interface RadioButtonProps {
  duration: number;
  handleDuration: (e: ChangeEvent<HTMLInputElement>) => void;
  buttons: { value: string }[];
}

const RadioButton: FC<RadioButtonProps> = ({
  duration,
  handleDuration,
  buttons,
}) => {
  return (
    <div className={styles.radioButton}>
      {buttons.map(({ value }) => (
        <div className={styles.btn} key={value}>
          <input
            type="radio"
            id={value}
            name="maxDuration"
            value={value}
            checked={duration === +value}
            onChange={handleDuration}
          />
          <label htmlFor={value}>{value} days</label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;
