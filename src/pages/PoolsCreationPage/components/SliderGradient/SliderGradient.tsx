import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';

import {
  colorByPercentSlider,
  getColorByPercent,
  calcRisk,
} from '@frakt/utils/bonds';
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
  const colorLTV = getColorByPercent(value, colorByPercentSlider);
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
            <span style={{ color: `${colorLTV}` }}>{calcRisk(value)}</span>
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
