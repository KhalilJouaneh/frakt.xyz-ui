import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';
import {
  colorByPercentSlider,
  getColorByPercent,
  calcRisk,
} from '@frakt/utils/bonds';

import styles from './SliderGradient.module.scss';
import Tooltip from '@frakt/components/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';

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
      <div className={styles.labelWrapper}>
        <div className={styles.label}>
          ltv{' '}
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.label}>
          risk level
          <span style={{ color: `${colorLTV}` }}>{calcRisk(value)}</span>
        </div>
      </div>
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
