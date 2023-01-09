import { FC } from 'react';

import LoansGeneralInfo from './components/LoansGeneralInfo/LoansGeneralInfo';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { MyLoansList } from './components/MyLoansList';
import SidebarForm from './components/SidebarForm';
import { useWallet } from '@solana/wallet-adapter-react';

const LoansPage: FC = () => {
  return (
    <AppLayout>
      <LoansGeneralInfo />
      <SidebarForm />
      <MyLoansList />
    </AppLayout>
  );
};

export default LoansPage;
