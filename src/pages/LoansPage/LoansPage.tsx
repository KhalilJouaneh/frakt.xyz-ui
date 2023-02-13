import { FC, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';

import { LoansGeneralInfo } from './components/LoansGeneralInfo';
import { Sidebar } from './components/Sidebar';
import { LoansPageContent } from './components/LoansPageContent';
import { useWalletLoans } from './hooks';
import { useHiddenLoansPubkeys, useSelectedLoans } from './loansState';
import styles from './LoansPage.module.scss';

const LoansPage: FC = () => {
  const wallet = useWallet();

  const { hiddenLoansPubkeys } = useHiddenLoansPubkeys();
  const { selection, setSelection, clearSelection } = useSelectedLoans();

  const { loans, isLoading } = useWalletLoans({
    walletPublicKey: wallet.publicKey,
  });

  //? Filter with optimistic update
  const filteredLoans = useMemo(() => {
    return loans.filter(({ pubkey }) => !hiddenLoansPubkeys.includes(pubkey));
  }, [hiddenLoansPubkeys, loans]);

  return (
    <AppLayout>
      {!!selection.length && <Sidebar />}
      <div
        className={classNames([
          styles.content,
          { [styles.contentSidebarVisible]: !!selection.length },
        ])}
      >
        <LoansGeneralInfo
          allLoans={filteredLoans}
          selection={selection}
          setSelection={setSelection}
          clearSelection={clearSelection}
        />

        <LoansPageContent loans={filteredLoans} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
};

export default LoansPage;
