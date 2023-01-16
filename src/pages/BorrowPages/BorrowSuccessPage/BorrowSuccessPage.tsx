import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { PATHS } from '@frakt/constants';
import Button from '@frakt/components/Button';

import styles from './BorrowSuccessPage.module.scss';
import { BorrowHeader } from '../components/BorrowHeader';

export const BorrowSuccessPage: FC = () => {
  return (
    <AppLayout>
      <BorrowHeader title="Borrowing" />
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Congrats! See your NFTs in My loans</h3>
        <NavLink to={PATHS.LOANS}>
          <Button className={styles.btn} type="secondary">
            Loans
          </Button>
        </NavLink>
      </div>
    </AppLayout>
  );
};
