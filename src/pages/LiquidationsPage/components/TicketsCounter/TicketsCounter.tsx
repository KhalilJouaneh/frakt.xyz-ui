import { FC } from 'react';

import styles from './TicketsCounter.module.scss';
import { Ticket } from '../../../../icons';

interface TicketsCounterProps {
  tickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({ tickets }) => {
  return (
    <div className={styles.ticket}>
      <Ticket className={styles.ticketIcon} />
      <h2 className={styles.value}>
        Your tickets: <span>{tickets}</span>
      </h2>
    </div>
  );
};
