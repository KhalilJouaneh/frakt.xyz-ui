import { FC } from 'react';
import { Ticket } from '@frakt/icons';

import styles from './TicketsCounter.module.scss';
import Tooltip from 'rc-tooltip';

interface TicketsCounterProps {
  currentTickets: number;
  totalTickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({
  currentTickets,
  totalTickets,
}) => {
  return (
    <Tooltip
      placement="top"
      trigger="hover"
      overlay="Spent tickets are refunded 24 hours after raffle ended"
    >
      <div className={styles.ticket}>
        <div className={styles.ticketIcon}>
          <Ticket />
        </div>
        <div className={styles.ticketInfo}>
          <div className={styles.title}>Tickets you have</div>
          <div className={styles.value}>
            {currentTickets || 0} / {totalTickets || 0}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
