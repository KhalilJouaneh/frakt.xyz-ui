import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';

import styles from './Slider.module.scss';

interface SliderGradientProps {
  value: number;
  setValue?: (nextValue: number) => void;
  className?: string;
  marks?: { [key: number]: string | JSX.Element };
  step?: number;
  withTooltip?: boolean;
  max?: number;
  min?: number;
  disabled?: boolean;
  label?: string;
}

const riskCheck = (value: number) => {
  if (value < 40) {
    return 'low';
  }
  if (40 <= value && value <= 70) {
    return 'medium';
  }
  if (value > 70 && value <= 100) {
    return 'high';
  }
};

export const SliderGradient: FC<SliderGradientProps> = ({
  className,
  marks,
  value,
  setValue,
  step,
  withTooltip,
  max,
  min,
  disabled,
  label,
}) => {
  return (
    <div
      className={classNames(
        withTooltip && styles.withTooltip,
        styles.slider,
        className,
      )}
    >
      {!!label && (
        <div className={styles.labelWrapper}>
          <div className={styles.label}>{label}</div>
          <div className={styles.label}>
            risk level
            <span
              className={classNames(styles.riskLevel, {
                [styles.one]: value <= 11,
                [styles.two]: value > 11 && value <= 22,
                [styles.three]: value > 22 && value <= 33,
                [styles.four]: value > 33 && value <= 44,
                [styles.five]: value > 44 && value <= 55,
                [styles.six]: value > 55 && value <= 66,
                [styles.seven]: value > 66 && value <= 77,
                [styles.eight]: value > 77 && value <= 89,
                [styles.nine]: value > 89 && value <= 100,
              })}
            >
              {riskCheck(value)}
            </span>
          </div>
        </div>
      )}
      <div className={styles.gradient}></div>
      <SliderAntd
        marks={marks}
        value={value}
        onChange={setValue}
        tooltipVisible={false}
        step={step}
        max={max}
        min={min}
        disabled={disabled}
      />
    </div>
  );
};
