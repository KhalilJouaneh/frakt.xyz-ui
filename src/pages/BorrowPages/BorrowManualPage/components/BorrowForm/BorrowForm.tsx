import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { Select } from '@frakt/components/Select';
import { useBorrow } from '@frakt/pages/BorrowPages/cartState';
import Tooltip from '@frakt/components/Tooltip';

import styles from './BorrowForm.module.scss';
import { generateLoanDetails } from './helpers';
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
          {`${isBulk ? 'View bulk loan' : 'Borrow'} ${(
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

  const fields = generateLoanDetails({
    nft: currentNft,
    loanType: currentLoanType,
    loanValue: currentLoanValue,
    pair: currentPair,
  });

  return (
    <div className={styles.loanDetails}>
      {fields.map(({ label, value, tooltipText }, idx) => (
        <div className={styles.loanDetailsValue} key={idx}>
          <span>
            {label}
            {tooltipText && (
              <Tooltip placement="bottom" trigger="hover" overlay={tooltipText}>
                <QuestionCircleOutlined className={styles.tooltipIcon} />
              </Tooltip>
            )}
          </span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
