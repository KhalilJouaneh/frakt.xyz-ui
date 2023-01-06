import { FC } from 'react';

import { StatsValues } from '@frakt/components/StatsValues';
import { Loan } from '@frakt/state/loans/types';
import Button from '@frakt/components/Button';
import styles from './RepayForm.module.scss';

interface RepayFormProps {
  nft: Loan;
  totalPayback: number;
  onSubmit: () => Promise<void>;
  isBulkRepay: boolean;
}

const RepayForm: FC<RepayFormProps> = ({
  nft,
  totalPayback,
  onSubmit,
  isBulkRepay,
}) => {
  const isGracePeriod = nft?.isGracePeriod;

  return (
    <>
      <div className={styles.content}>
        {isGracePeriod ? (
          <>
            <StatsValues label="borrowed" value={nft?.loanValue} />
            <StatsValues label="remaining debt" value={nft?.liquidationPrice} />
          </>
        ) : (
          <StatsValues label="repay value" value={nft?.repayValue} />
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
