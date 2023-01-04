import { FC } from 'react';
import cx from 'classnames';

import { AppLayout } from '../../components/Layout/AppLayout';
import { MyLoansList } from './components/MyLoansList';
import SidebarForm from './components/SidebarForm';
import { useSelectableNftsState } from './hooks';
import styles from './LoansPage.module.scss';

const LoansPage: FC = () => {
  const { selectedNfts } = useSelectableNftsState();

  return (
    <AppLayout>
      <div
        className={cx(styles.header, {
          [styles.headerActive]: !!selectedNfts.length,
        })}
      >
        <div>
          <h1 className={styles.title}>My Loans</h1>
          <h2 className={styles.subtitle}>JPEGs you borrowed SOL for</h2>
        </div>
      </div>
      <SidebarForm />
      <MyLoansList />
    </AppLayout>
  );
};

export default LoansPage;
