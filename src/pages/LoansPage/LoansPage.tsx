import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { MyLoansList } from './components/MyLoansList';
import styles from './LoansPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LoansPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Loans</h1>
          <h2 className={styles.subtitle}>Keep track of your loans</h2>
        </div>
      </div>
      <MyLoansList />
    </AppLayout>
  );
};

export default LoansPage;
