import { FC } from 'react';
import cx from 'classnames';

import Button from '@frakt/components/Button';
import styles from './SliderButtons.module.scss';
import { Chevron } from '@frakt/icons';

interface SliderButtonsProps {
  onPrev: (value: number) => void;
  onNext: (value: number) => void;
}

const SliderButtons: FC<SliderButtonsProps> = ({ onPrev, onNext }) => {
  return (
    <div className={styles.btnWrapper}>
      <Button
        className={cx(styles.btn, styles.rotateLeft)}
        type="tertiary"
        onClick={onPrev}
      >
        <Chevron />
      </Button>
      <Button
        className={cx(styles.btn, styles.rotateRight)}
        type="tertiary"
        onClick={onNext}
      >
        <Chevron />
      </Button>
    </div>
  );
};

export default SliderButtons;
