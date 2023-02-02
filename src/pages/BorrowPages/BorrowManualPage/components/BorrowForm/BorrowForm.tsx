import { FC } from 'react';
import { debounce } from 'lodash';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';

import styles from './BorrowForm.module.scss';
import { SelectValue } from './helpers';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  onSubmit: () => void;
}
export const BorrowForm: FC<BorrowFormProps> = ({ onSubmit }) => {
  const {
    totalBorrowValue,
    selectedBorrowValue,
    onSliderUpdate,
    borrowRange,
    selectOptions,
    selectedOption,
    onOptionChange,
    // isBulk,
  } = useBorrowForm();

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <div className={styles.borrowFormLtvSliderWrapper}>
          <p className={styles.borrowFormLtvSliderLabel}>
            To borrow: {(selectedBorrowValue / 1e9)?.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={{
              [borrowRange[0]]: `${(borrowRange[0] / 1e9).toFixed(2)} SOL`,
              [borrowRange[1]]: `${(borrowRange[1] / 1e9).toFixed(2)} SOL`,
            }}
            className={styles.borrowFormLtvSlider}
            defaultValue={selectedBorrowValue}
            step={0.1}
            setValue={debounce((nextValue) => onSliderUpdate(nextValue), 300)}
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
          {/* {`${isBulk ? 'View bulk ' : 'Quick borrow '} loan ${(
            totalBorrowValue / 1e9
          ).toFixed(2)} SOL`} */}
          Quick borrow {(totalBorrowValue / 1e9).toFixed(2)} SOL
        </Button>
      </div>
    </div>
  );
};
