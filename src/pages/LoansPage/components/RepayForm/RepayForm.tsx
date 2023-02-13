import { FC } from 'react';

import { StatsValues } from '@frakt/components/StatsValues';
import Button from '@frakt/components/Button';
import { Loan } from '@frakt/api/loans';

import styles from './RepayForm.module.scss';

interface RepayFormProps {
  loan: Loan;
  totalPayback: number;
  onSubmit: () => Promise<void>;
  isBulkRepay: boolean;
}

const RepayForm: FC<RepayFormProps> = ({
  loan,
  totalPayback,
  onSubmit,
  isBulkRepay,
}) => {
  const onGracePeriod = !!loan.gracePeriod;

  return (
    <>
      <div className={styles.content}>
        {onGracePeriod ? (
          <>
            <StatsValues label="borrowed" value={loan?.loanValue / 1e9} />
            <StatsValues label="remaining debt" value={loan.repayValue / 1e9} />
          </>
        ) : (
          <StatsValues label="repay value" value={loan?.repayValue / 1e9} />
        )}
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={onSubmit}
          type="secondary"
          className={styles.continueBtn}
        >
          {isBulkRepay
            ? `Bulk repay ${totalPayback?.toFixed(2)} SOL`
            : `Quick repay ${totalPayback?.toFixed(2)} SOL`}
        </Button>
      </div>
    </>
  );
};

export default RepayForm;
