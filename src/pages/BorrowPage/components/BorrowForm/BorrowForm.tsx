import { FC } from 'react';

import { LoadingModal } from '../../../../components/LoadingModal';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { getRisk, useLoanFields } from '../LoanFields/hooks';
import { Slider } from '../../../../components/Slider';
import { Select } from '../../../../components/Select';
import { Loader } from '@frakt/components/Loader';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { useLoanTxns } from './useLoanTxns';
import { BorrowNft } from '@frakt/api/nft';
import { useBorrowForm } from './hooks';
import LoansFields from '../LoanFields';

interface BorrowFormProps {
  selectedNft: BorrowNft;
  isBulkLoan?: boolean;
  onDeselect?: () => void;
  onClick?: () => void;
  totalBorrowed?: number;
}

export enum BorrowFormType {
  PERPETUAL = 'perpetual',
  FLIP = 'flip',
  BOND = 'bond',
}

const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
  isBulkLoan,
  onClick,
  totalBorrowed,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    confirmText,
    selectOptions,
    selectValue,
    updateCurrentNft,
    solLoanValue,
    setSolLoanValue,
    setSelectValue,
  } = useBorrowForm({
    selectedNft,
  });

  const {
    marks,
    maxLoanValue,
    minLoanValueNumber,
    isLoading,
    market,
    pairs,
    existBestOffer,
  } = useLoanFields(selectedNft, solLoanValue, selectValue);

  const ltv = (solLoanValue / parseFloat(selectedNft.valuation)) * 100;
  const risk = getRisk({ LTV: ltv, limits: [10, ltv] });

  const { proposeBondLoan, proposeLoan } = useLoanTxns({ onDeselect });

  const onSubmit = (nft: BorrowNft) => {
    if (existBestOffer) {
      console.log('here');
      proposeBondLoan({ nft, market, pairs, borrowValue: solLoanValue });
    } else {
      proposeLoan(nft);
    }
  };

  return (
    <>
      {isLoading && <Loader size="large" />}
      {!!market && !!pairs && (
        <div className={styles.details}>
          <div className={styles.sliderWrapper}>
            <p className={styles.sliderLabel}>
              To borrow: {solLoanValue?.toFixed(2)} SOL{' '}
            </p>
            <Slider
              marks={marks}
              className={styles.slider}
              value={solLoanValue}
              step={0.1}
              setValue={setSolLoanValue}
              min={minLoanValueNumber}
              max={maxLoanValue}
            />
          </div>
          <p className={styles.detailsTitle}>Duration</p>
          <Select
            className={styles.select}
            options={selectOptions}
            value={selectValue}
            onChange={({ value }) => setSelectValue(value)}
            defaultValue={selectOptions[0]}
            disabled={!selectedNft.priceBased}
          />
          <LoansFields
            risk={risk}
            ltv={ltv}
            nft={selectedNft}
            loanTypeValue={selectValue}
            solLoanValue={solLoanValue}
          />
        </div>
      )}
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={
            isBulkLoan
              ? () => {
                  updateCurrentNft();
                  onClick();
                }
              : openConfirmModal
          }
          type="secondary"
          className={styles.continueBtn}
        >
          {isBulkLoan
            ? `View bulk loan ${totalBorrowed.toFixed(2)}  SOL`
            : `Quick borrow ${solLoanValue?.toFixed(3)}`}
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={() => onSubmit(selectedNft)}
        title="Ready?"
        subtitle={confirmText}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to transfer the NFT/s approval is needed"
      />
    </>
  );
};

export default BorrowForm;
