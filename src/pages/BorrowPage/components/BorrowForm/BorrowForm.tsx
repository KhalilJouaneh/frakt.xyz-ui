import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { loansActions } from '../../../../state/loans/actions';
import { BorrowNft } from '../../../../state/loans/types';
import Select from '../../../../componentsNew/Select';
import Button from '../../../../components/Button';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';
import LoansFields from '../LoanFields';
import { useLoanFields } from '../LoanFields/hooks';
import { Slider } from '../../../../components/Slider';

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
    onSubmit,
    confirmText,
    selectOptions,
    selectValue,
    setSelectValue,
    updateCurrentNft,
  } = useBorrowForm({
    onDeselect,
    selectedNft,
  });

  const {
    marks,
    maxLoanValueNumber,
    minLoanValueNumber,
    solLoanValue,
    setSolLoanValue,
    ltv,
  } = useLoanFields(selectedNft);

  const dispatch = useDispatch();

  console.log(solLoanValue);

  useEffect(() => {
    dispatch(
      loansActions.setCurrentLoanNft({
        ...selectedNft,
        solLoanValue: solLoanValue,
        ltv,
        type: selectValue,
      }),
    );
  }, [solLoanValue, selectValue, selectedNft]);

  const isPriceBasedType = selectValue === 'perpetual';

  const sliderValue = isPriceBasedType ? solLoanValue : maxLoanValueNumber;
  const defaultSliderValue = (selectedNft as any)?.solLoanValue;

  useEffect(() => {
    if (defaultSliderValue) {
      setSolLoanValue(defaultSliderValue || 0);
    } else {
      setSolLoanValue(sliderValue);
    }
  }, [selectedNft]);

  const borrowValue =
    selectValue === BorrowFormType.PERPETUAL
      ? solLoanValue.toFixed(3)
      : selectedNft?.timeBased?.loanValue;

  return (
    <>
      <div className={styles.details}>
        <Select
          setValue={(e: any) => setSelectValue(e.target.value)}
          options={selectOptions}
          value={selectValue}
        />
        <div className={styles.sliderWrapper}>
          <p className={styles.sliderLabel}>
            loan to value: {sliderValue.toFixed(2)} SOL{' '}
          </p>
          <Slider
            marks={marks}
            className={styles.slider}
            value={sliderValue}
            step={0.1}
            setValue={setSolLoanValue}
            min={minLoanValueNumber}
            max={maxLoanValueNumber}
            disabled={!isPriceBasedType}
          />
        </div>

        <LoansFields nft={selectedNft} loanTypeValue={selectValue} />
      </div>
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
            : `Quick borrow ${borrowValue}`}
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
