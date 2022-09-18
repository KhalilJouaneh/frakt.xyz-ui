import { FC } from 'react';

import styles from './TicketsCounter.module.scss';

interface TicketsCounterProps {
  tickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({ tickets }) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.title}>Your tickets:</div>
      <div className={styles.value}>{tickets}</div>
    </div>
  );
};
