import { FC } from 'react';

import { LoanCard } from '@frakt/pages/LoansPage/components/LoanCard';
import styles from './LoansList.module.scss';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '@frakt/components/InfinityScroll';
import { Loan } from '@frakt/api/loans';
import { useSelectedLoans } from '../../loansState';

interface LoansListProps {
  loans: Loan[];
  isLoading: boolean;
}

export const LoansList: FC<LoansListProps> = ({ loans, isLoading }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(48);

  const { findLoanInSelection, toggleLoanInSelection } = useSelectedLoans();

  return (
    <InfinityScroll
      itemsToShow={itemsToShow}
      isLoading={isLoading}
      next={next}
      wrapperClassName={styles.loansList}
      emptyMessage="No loans taken"
    >
      {loans.map((loan) => (
        <LoanCard
          selected={!!findLoanInSelection(loan.pubkey)}
          onSelect={() => {
            toggleLoanInSelection(loan);
          }}
          key={loan.pubkey}
          loan={loan}
        />
      ))}
    </InfinityScroll>
  );
};
