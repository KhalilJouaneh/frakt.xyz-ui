import { FC } from 'react';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';
import { Market, Pair } from '@frakt/api/bonds';

import { BorrowNftSelected } from '../../../selectedNftsState';
import styles from './BorrowForm.module.scss';
import { SelectValue } from './helpers';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  nft: BorrowNftSelected;
  updateNftInSelection: (nft: BorrowNftSelected) => void;
  totalBorrowValue: number;
  isBulk?: boolean;
  onSubmit: () => void;
  market?: Market;
  pairs?: Pair[];
}
export const BorrowForm: FC<BorrowFormProps> = ({
  nft,
  totalBorrowValue,
  isBulk,
  updateNftInSelection,
  onSubmit,
  market,
  pairs,
}) => {
  const {
    selectedBorrowValue,
    onSliderUpdate,
    borrowRange,
    selectOptions,
    selectedOption,
    onOptionChange,
  } = useBorrowForm({ nft, market, pairs, updateNftInSelection });

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <div className={styles.borrowFormLtvSliderWrapper}>
          <p className={styles.borrowFormLtvSliderLabel}>
            To borrow: {selectedBorrowValue?.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={{
              [borrowRange[0]]: `${borrowRange[0].toFixed(2)} SOL`,
              [borrowRange[1]]: `${borrowRange[1].toFixed(2)} SOL`,
            }}
            className={styles.borrowFormLtvSlider}
            value={selectedBorrowValue}
            step={0.1}
            setValue={onSliderUpdate}
            min={borrowRange[0]}
            max={borrowRange[1]}
          />
        </div>
        <p className={styles.borrowFormDetailsTitle}>Duration</p>
        <Select
          className={styles.borrowFormSelect}
          options={selectOptions}
          value={selectedOption}
          onChange={(value: SelectValue) => {
            onOptionChange(value);
          }}
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
