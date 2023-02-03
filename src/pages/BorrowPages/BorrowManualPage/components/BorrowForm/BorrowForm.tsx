import { FC } from 'react';
import { debounce } from 'lodash';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';

import styles from './BorrowForm.module.scss';
import {
  calcBondFee,
  calcLtv,
  calcPriceBasedUpfrontFee,
  calcTimeBasedRepayValue,
  SelectValue,
} from './helpers';
import { useBorrowForm } from './hooks';
import { useCart } from '@frakt/pages/BorrowPages/cartState';
import { LoanType } from '@frakt/api/loans';

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
        <LoanDetails />
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

const LoanDetails = () => {
  const { currentOrder, pairs } = useCart();

  if (!currentOrder) return null;

  const fields: Array<[string, string]> = [];

  const { loanType, borrowNft } = currentOrder;

  const { valuation } = borrowNft;
  fields.push(['Floor price', (valuation / 1e9).toFixed(2)]);

  const ltv = calcLtv(currentOrder);

  fields.push(['LTV', `${ltv.toFixed(0)}%`]);

  if (loanType === LoanType.TIME_BASED) {
    const { fee } = borrowNft.classicParams.timeBased;

    fields.push(['Fee', `${(fee / 1e9).toFixed(2)}`]);
  }

  if (loanType === LoanType.BOND) {
    const fee = calcBondFee({
      order: currentOrder,
      pair: pairs.find(
        ({ publicKey }) => publicKey === currentOrder.bondParams.pairPubkey,
      ),
    });

    fields.push(['Fee', `${(fee / 1e9).toFixed(2)}`]);

    const repayValue = currentOrder.loanValue + fee;
    fields.push(['Repay value', `${(repayValue / 1e9).toFixed(2)}`]);
  }

  if (loanType === LoanType.TIME_BASED) {
    const feeDiscountPercent =
      borrowNft.classicParams.timeBased.feeDiscountPercent;
    feeDiscountPercent &&
      fields.push(['Holder discount', `${feeDiscountPercent.toFixed(2)}%`]);
  }

  if (loanType === LoanType.TIME_BASED) {
    const repayValue = calcTimeBasedRepayValue(currentOrder);
    fields.push(['Repay value', `${(repayValue / 1e9).toFixed(2)}`]);
  }

  if (loanType === LoanType.PRICE_BASED) {
    const upfrontFee = calcPriceBasedUpfrontFee(currentOrder);
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
