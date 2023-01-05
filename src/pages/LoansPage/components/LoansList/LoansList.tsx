import { FC } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  useSelectableNfts,
  useSelectableNftsState,
} from '@frakt/pages/LoansPage/hooks';
import { selectUserLoansPending } from '@frakt/state/loans/selectors';
import LoanCard from '@frakt/components/LoanCard';
import { Loan } from '@frakt/state/loans/types';
import styles from './LoansList.module.scss';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '@frakt/components/InfinityScroll';

interface LoansListProps {
  className?: string;
  loans: Loan[];
}

export const LoansList: FC<LoansListProps> = ({ className, loans }) => {
  const { itemsToShow, next } = useFakeInfinityScroll(48);
  const loading: boolean = useSelector(selectUserLoansPending);

  const { setCurrentSelectedIdx, selectedNfts } = useSelectableNftsState();
  const { onNftClick, isNftSelected } = useSelectableNfts();

  const currentNftIdx = selectedNfts.length - 1 < 0 ? 0 : selectedNfts.length;

  return (
    <InfinityScroll
      itemsToShow={itemsToShow}
      isLoading={loading}
      next={next}
      wrapperClassName={classNames(
        styles.loansList,
        { [styles.loansListCollapsed]: !!selectedNfts.length },
        className,
      )}
      emptyMessage="No loans taken"
    >
      {loans.map((loan) => (
        <LoanCard
          selected={isNftSelected(loan)}
          onClick={() => {
            setCurrentSelectedIdx(currentNftIdx);
            onNftClick(loan);
          }}
          key={loan.mint}
          loan={loan}
        />
      ))}
    </InfinityScroll>
  );
};
