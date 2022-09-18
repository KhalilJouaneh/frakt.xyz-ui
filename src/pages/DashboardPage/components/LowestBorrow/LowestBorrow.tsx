import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import { LastLoans } from '../../../../state/stats/types';
import Block from '../Block';
import styles from './LowestBorrow.module.scss';

interface LowestBorrowProps {
  lastLoans: LastLoans[];
}

const LowestBorrow: FC<LowestBorrowProps> = ({ lastLoans }) => {
  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Lowest fees on borrowing</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Collections</p>
        <p className={styles.headerTitle}>Grace period</p>
      </div>
      <div className={styles.content}>
        {lastLoans.map(({ nftName, image }, idx) => (
          <div key={idx} className={styles.tableRow}>
            <div className={styles.tableInfo}>
              <img className={styles.rowImage} src={image} />
              <p className={styles.nftName}>{nftName}</p>
            </div>
            <p className={styles.value}>3 %</p>
          </div>
        ))}
      </div>
      <NavLink to={PATHS.BORROW}>
        <Button className={styles.btn} type="secondary">
          Borrow
        </Button>
      </NavLink>
    </Block>
  );
};

export default LowestBorrow;
