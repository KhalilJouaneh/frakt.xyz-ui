import classNames from 'classnames';
import styles from './RadioButton.module.scss';

export interface RBOption<T> {
  label: string;
  value: T;
}

interface RadioButtonProps<T> {
  currentOption: RBOption<T>;
  onOptionChange: (nextOption: RBOption<T>) => void;
  options: RBOption<T>[];
  className?: string;
}

export const RadioButton = <T extends unknown>({
  currentOption,
  options,
  onOptionChange,
  className,
}: RadioButtonProps<T>) => {
  return (
    <div className={classNames(styles.radioButton, className)}>
      {options.map((option) => (
        <div className={styles.btn} key={option.label}>
          <input
            type="radio"
            id={option.label}
            name={option.label}
            value={option.label}
            checked={option.label === currentOption.label}
            onChange={() => onOptionChange(option)}
          />
          <label htmlFor={option.label}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};
