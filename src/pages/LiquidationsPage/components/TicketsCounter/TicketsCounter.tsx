import { FC } from 'react';
import Icons from '@frakt/iconsNew';

import styles from './TicketsCounter.module.scss';

interface TicketsCounterProps {
  tickets: number;
  availableTickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({
  tickets,
  availableTickets,
}) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketIcon}>
        <Icons.Ticket />
      </div>
      <div className={styles.ticketInfo}>
        <div className={styles.title}>Tickets you have</div>
        <div className={styles.value}>
          {availableTickets} / {tickets}
        </div>
      </div>
    </div>
  );
};
