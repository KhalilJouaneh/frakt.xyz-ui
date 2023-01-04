import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';

import styles from './Slider.module.scss';

interface SliderProps {
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

export const Slider: FC<SliderProps> = ({
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
        <div className={classNames(styles.label, styles.labelFlex)}>
          {label}
          {/* {toolTipText && (
            <Tooltip placement="bottom" overlay={toolTipText}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          )} */}
        </div>
      )}
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
