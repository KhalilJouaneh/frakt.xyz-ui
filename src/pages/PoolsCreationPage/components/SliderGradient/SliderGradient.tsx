import { FC } from 'react';
import {
  colorByPercentSlider,
  getColorByPercent,
  calcRisk,
} from '@frakt/utils/bonds';

import { riskMarks } from '../../hooks/usePoolCreation';
import { Slider } from '@frakt/components/Slider';
import Tooltip from '@frakt/components/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './SliderGradient.module.scss';

interface SliderGradientProps {
  value: number;
  setValue?: (nextValue: number) => void;
  disabled?: boolean;
}

export const SliderGradient: FC<SliderGradientProps> = ({
  value,
  setValue,
  disabled,
}) => {
  const colorLTV = getColorByPercent(value, colorByPercentSlider);
  return (
    <div>
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
      <Slider
        className={styles.slider}
        marks={riskMarks}
        value={value}
        setValue={setValue}
        withTooltip
        step={1}
        min={10}
        max={100}
        disabled={disabled}
      />
    </div>
  );
};
