import { FC } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Button from '../../../../components/Button';
import { PATHS } from '../../../../constants';
import { SolanaIcon } from '../../../../icons';
import { selectLiquidityPools } from '../../../../state/loans/selectors';
import { LastLoans } from '../../../../state/stats/types';
import Block from '../Block';
import styles from './LowestBorrow.module.scss';

interface LowestBorrowProps {
  lastLoans: LastLoans[];
}

const LowestBorrow: FC<LowestBorrowProps> = ({ lastLoans }) => {
  const liquidityPools = useSelector(selectLiquidityPools);

  return (
    <Block className={styles.block}>
      <h3 className={styles.subtitle}>Lowest fees on borrowing</h3>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Collections</p>
        <p className={styles.headerTitle}>Fee</p>
      </div>
      <div className={styles.content}>
        {lastLoans.map(({ nftName, image }, idx) => (
          <div key={idx} className={styles.tableRow}>
            <div className={styles.tableInfo}>
              <img className={styles.rowImage} src={image} />
              <p className={styles.nftName}>{nftName}</p>
            </div>
            <p className={styles.value}>
              3 <SolanaIcon />
            </p>
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
