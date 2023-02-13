import { FC } from 'react';
import { sum, map } from 'lodash';

import Button from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';
import { StatsValuesColumn } from '@frakt/components/StatsValues';

import styles from './LoansGeneralInfo.module.scss';

interface LoansGeneralInfoProps {
  allLoans: Loan[];
  selection: Loan[];
  setSelection: (selection: Loan[]) => void;
  clearSelection: () => void;
}

export const LoansGeneralInfo: FC<LoansGeneralInfoProps> = ({
  allLoans,
  selection,
  setSelection,
  clearSelection,
}) => {
  const totalBorrowed = sum(map(allLoans, ({ loanValue }) => loanValue / 1e9));
  const totalDebt = sum(map(allLoans, ({ repayValue }) => repayValue / 1e9));

  const onBtnClick = () => {
    !selection.length ? setSelection(allLoans) : clearSelection();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Loans</h1>
          <h2 className={styles.subtitle}>JPEGs you borrowed SOL for</h2>
        </div>
        <div className={styles.stats}>
          <StatsValuesColumn
            className={styles.values}
            label={'Total borrowed:'}
            icon={false}
            textCenter
          >
            {totalBorrowed ? totalBorrowed?.toFixed(2) : '--'} SOL
          </StatsValuesColumn>
          <StatsValuesColumn
            className={styles.values}
            label={'Total Debt:'}
            icon={false}
            textCenter
          >
            {totalDebt ? totalDebt?.toFixed(2) : '--'} SOL
          </StatsValuesColumn>
        </div>
        <Button
          onClick={onBtnClick}
          className={styles.btn}
          disabled={!allLoans.length}
          type="secondary"
        >
          {selection.length ? 'Deselect all' : 'Select all'}
        </Button>
      </div>
    </div>
  );
};
