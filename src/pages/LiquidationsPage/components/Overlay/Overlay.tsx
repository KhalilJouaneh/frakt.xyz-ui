import { FC } from 'react';
import pepeImage from '../Liquidations/mock/Pepe.png';
import styles from './Overlay.module.scss';

const Overlay: FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <img className={styles.image} src={pepeImage} />
        <h3 className={styles.title}>Soon, just wait a little bit...</h3>
        <p className={styles.subtitle}>
          Soon {"you'll"} be able to try out the new raffle system and try luck
          to buy some bluechips at a juicy discount
        </p>
      </div>
    </div>
  );
};

export default Overlay;
