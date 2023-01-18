import { FC, useMemo } from 'react';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';

import { BorrowNftSelected } from '../../../selectedNftsState';
import styles from './BorrowForm.module.scss';
import { generateSelectOptions, getBorrowValueRange } from './helpers';

interface BorrowFormProps {
  nft: BorrowNftSelected;
  updateNftInSelection: (nft: BorrowNftSelected) => void;
  totalBorrowValue: number;
  isBulk?: boolean;
  onSubmit: () => void;
}
export const BorrowForm: FC<BorrowFormProps> = ({
  nft,
  totalBorrowValue,
  isBulk,
  updateNftInSelection,
  onSubmit,
}) => {
  const { solLoanValue } = nft;

  const [minBorrowValue, maxBorrowValue] = useMemo(
    () => getBorrowValueRange(nft),
    [nft],
  );

  const loanTypeSelectOptions = generateSelectOptions(nft);

  const loanTypeOption = loanTypeSelectOptions.find((option) =>
    nft.isPriceBased
      ? option.value === 'priceBased'
      : option.value === 'timeBased',
  );

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <div className={styles.borrowFormLtvSliderWrapper}>
          <p className={styles.borrowFormLtvSliderLabel}>
            To borrow: {solLoanValue?.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={{
              [minBorrowValue]: `${minBorrowValue.toFixed(2)} SOL`,
              [maxBorrowValue]: `${maxBorrowValue.toFixed(2)} SOL`,
            }}
            className={styles.borrowFormLtvSlider}
            value={solLoanValue}
            step={0.1}
            setValue={(solLoanValue) =>
              updateNftInSelection({
                ...nft,
                solLoanValue,
              })
            }
            min={minBorrowValue}
            max={maxBorrowValue}
          />
        </div>
        <p className={styles.borrowFormDetailsTitle}>Duration</p>
        <Select
          className={styles.borrowFormSelect}
          options={loanTypeSelectOptions}
          value={loanTypeOption.value}
          onChange={({ value }) => {
            updateNftInSelection({
              ...nft,
              isPriceBased: value === 'priceBased',
            });
          }}
          disabled={!nft.priceBased}
        />
        {/* <LoansFields
          risk={risk}
          ltv={ltv}
          nft={selectedNft}
          loanTypeValue={selectValue}
          solLoanValue={solLoanValue}
        /> */}
      </div>
      <div className={styles.borrowFormSubmitBtnWrapper}>
        <Button
          onClick={onSubmit}
          type="secondary"
          className={styles.borrowFormSubmitBtn}
        >
          {`${
            isBulk ? 'View bulk ' : 'Quick borrow '
          } loan ${totalBorrowValue.toFixed(2)} SOL`}
        </Button>
      </div>
    </div>
  );
};
