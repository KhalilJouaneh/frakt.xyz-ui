import { FC } from 'react';
import Icons from '../../../../iconsNew';

import styles from './TicketsCounter.module.scss';

interface TicketsCounterProps {
  tickets: number;
}

export const TicketsCounter: FC<TicketsCounterProps> = ({ tickets }) => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketIcon}>
        <Icons.Ticket />
      </div>
      <div className={styles.ticketInfo}>
        <div className={styles.title}>Tickets you have</div>
        <div className={styles.value}>{tickets || 0}</div>
      </div>
    </div>
  );
};
