import { FC } from 'react';

import { useCountdown } from '@frakt/hooks';
import { Bond } from '@frakt/api/bonds';
import { Timer } from '@frakt/icons';

import styles from './TableCells.module.scss';

export const ExperationCell: FC<{ bond: Bond }> = ({ bond }) => {
  const { timeLeft } = useCountdown(bond?.fbond.liquidatingAt);

  return (
    <div className={styles.value}>
      <Timer className={styles.timer} />{' '}
      <div className={styles.countdown}>
        <span>{timeLeft.days}d </span>
        <span>: {timeLeft.hours}h</span>
        <span>: {timeLeft.minutes}m</span>
      </div>
    </div>
  );
};
