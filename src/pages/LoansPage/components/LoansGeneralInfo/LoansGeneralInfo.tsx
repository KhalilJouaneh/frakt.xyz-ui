import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';
import { map, sum } from 'ramda';
import cx from 'classnames';

import { selectLoanNfts, selectTotalDebt } from '@frakt/state/loans/selectors';
import { useSelectableNfts, useSelectableNftsState } from '../../hooks';
import { StatsValuesColumn } from '@frakt/components/StatsValues';
import styles from './LoansGeneralInfo.module.scss';
import { Loan } from '@frakt/state/loans/types';
import Button from '@frakt/components/Button';

const LoansGeneralInfo: FC = () => {
  const { connected } = useWallet();
  const { selectedNfts } = useSelectableNftsState();
  const totalDebt = useSelector(selectTotalDebt);
  const userLoans: Loan[] = useSelector(selectLoanNfts);
  const { toggleSelectAllNfts } = useSelectableNfts(userLoans);

  const totalBorrowed = sum(map(({ loanValue }) => loanValue, userLoans));

  return (
    <div
      className={cx(styles.wrapper, {
        [styles.headerActive]: !!selectedNfts.length,
      })}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Loans</h1>
          <h2 className={styles.subtitle}>JPEGs you borrowed SOL for</h2>
        </div>
        <div
          className={cx(styles.stats, {
            [styles.statsActive]: !!selectedNfts.length,
          })}
        >
          <StatsValuesColumn
            className={styles.values}
            label={'Total borrowed:'}
            icon={false}
            textCenter
          >
            {connected ? totalBorrowed?.toFixed(2) : '--'} SOL
          </StatsValuesColumn>
          <StatsValuesColumn
            className={styles.values}
            label={'Total Debt:'}
            icon={false}
            textCenter
          >
            {connected ? totalDebt?.toFixed(2) : '--'} SOL
          </StatsValuesColumn>
        </div>
        <Button
          onClick={toggleSelectAllNfts}
          className={styles.btn}
          disabled={!userLoans.length}
          type="secondary"
        >
          {selectedNfts.length ? 'Deselect all' : 'Select all'}
        </Button>
      </div>
    </div>
  );
};

export default LoansGeneralInfo;
