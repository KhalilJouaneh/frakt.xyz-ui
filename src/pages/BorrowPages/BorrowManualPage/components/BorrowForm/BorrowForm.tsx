import { FC } from 'react';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';
import { LoanType } from '@frakt/api/loans';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';

import styles from './BorrowForm.module.scss';
import {
  calcBondFee,
  calcLtv,
  calcPriceBasedUpfrontFee,
  calcTimeBasedRepayValue,
} from './helpers';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  onSubmit: () => void;
}
export const BorrowForm: FC<BorrowFormProps> = ({ onSubmit }) => {
  const {
    currentLoanValue,
    minBorrowValue,
    maxBorrowValue,
    setCurrentLoanValue,
    selectOptions,
    selectedOption,
    onSelectOption,
    isBulk,
    totalBorrowValue,
  } = useBorrowForm();

  return (
    <div className={styles.borrowForm}>
      <div className={styles.borrowFormDetails}>
        <div className={styles.borrowFormLtvSliderWrapper}>
          <p className={styles.borrowFormLtvSliderLabel}>
            To borrow: {(currentLoanValue / 1e9)?.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={{
              [minBorrowValue]: `${(minBorrowValue / 1e9).toFixed(2)} SOL`,
              [maxBorrowValue]: `${(maxBorrowValue / 1e9).toFixed(2)} SOL`,
            }}
            className={styles.borrowFormLtvSlider}
            value={currentLoanValue}
            step={0.1}
            setValue={(nextValue) => setCurrentLoanValue(nextValue)}
            min={minBorrowValue}
            max={maxBorrowValue}
          />
        </div>
        <p className={styles.borrowFormDetailsTitle}>Duration</p>
        {!!selectedOption && (
          <>
            <Select
              className={styles.borrowFormSelect}
              options={selectOptions}
              value={selectedOption}
              onChange={onSelectOption}
            />
            <LoanDetails />
          </>
        )}
      </div>
      <div className={styles.borrowFormSubmitBtnWrapper}>
        <Button
          onClick={onSubmit}
          type="secondary"
          className={styles.borrowFormSubmitBtn}
        >
          {`${isBulk ? 'View bulk ' : 'Quick borrow '} loan ${(
            totalBorrowValue / 1e9
          ).toFixed(2)} SOL`}
        </Button>
      </div>
    </div>
  );
};

const LoanDetails: FC = () => {
  const { currentNft, currentPair, currentLoanType, currentLoanValue } =
    useBorrow();

  if (!currentNft || !currentLoanType) return null;

  const fields: Array<[string, string]> = [];

  const { valuation } = currentNft;
  fields.push(['Floor price', (valuation / 1e9).toFixed(2)]);

  const ltv = calcLtv({
    loanValue: currentLoanValue,
    nft: currentNft,
  });

  fields.push(['LTV', `${ltv.toFixed(0)}%`]);

  if (currentLoanType === LoanType.TIME_BASED) {
    const { fee } = currentNft.classicParams.timeBased;

    fields.push(['Fee', `${(fee / 1e9).toFixed(2)}`]);
  }

  if (currentLoanType === LoanType.BOND && currentPair) {
    const fee = calcBondFee({
      loanValue: currentLoanValue,
      pair: currentPair,
    });

    fields.push(['Fee', `${(fee / 1e9).toFixed(2)}`]);

    const repayValue = currentLoanValue + fee;
    fields.push(['Repay value', `${(repayValue / 1e9).toFixed(2)}`]);
  }

  if (currentLoanType === LoanType.TIME_BASED) {
    const feeDiscountPercent =
      currentNft.classicParams.timeBased.feeDiscountPercent;
    feeDiscountPercent &&
      fields.push(['Holder discount', `${feeDiscountPercent.toFixed(2)}%`]);
  }

  if (currentLoanType === LoanType.TIME_BASED) {
    const repayValue = calcTimeBasedRepayValue({
      nft: currentNft,
      loanValue: currentLoanValue,
    });
    fields.push(['Repay value', `${(repayValue / 1e9).toFixed(2)}`]);
  }

  if (currentLoanType === LoanType.PRICE_BASED) {
    const upfrontFee = calcPriceBasedUpfrontFee({
      loanValue: currentLoanValue,
    });
    fields.push(['Upfront fee', `${(upfrontFee / 1e9).toFixed(2)}`]);
  }

  return (
    <div className={styles.loanDetails}>
      {fields.map(([label, value], idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
