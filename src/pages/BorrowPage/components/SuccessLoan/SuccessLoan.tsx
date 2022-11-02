import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button';
import styles from './SuccessLoan.module.scss';
import { PATHS } from '../../../../constants';

const SuccessLoan: FC = () => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Congrats! See your NFTs in My loans</h3>
      <NavLink to={PATHS.LOANS}>
        <Button className={styles.btn} type="secondary">
          Loans
        </Button>
      </NavLink>
    </div>
  );
};

export default SuccessLoan;
