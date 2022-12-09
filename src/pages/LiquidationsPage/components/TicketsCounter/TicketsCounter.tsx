import { FC } from 'react';
import Icons from '@frakt/iconsNew';

import styles from './TicketsCounter.module.scss';

interface TicketsCounterProps {
  currentTickets: number;
  totalTickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({
  currentTickets,
  totalTickets,
}) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketIcon}>
        <Icons.Ticket />
      </div>
      <div className={styles.ticketInfo}>
        <div className={styles.title}>Tickets you have</div>
        <div className={styles.value}>
          {currentTickets || 0} / {totalTickets || 0}
        </div>
      </div>
    </div>
  );
};
