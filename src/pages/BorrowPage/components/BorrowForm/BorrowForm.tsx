import { FC, useEffect } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { BorrowNft } from '../../../../state/loans/types';
import { ShortTermFields } from '../ShortTermFields';
import { Tabs } from '../../../../components/Tabs';
import Button from '../../../../components/Button';
import LongTermFields from '../LongTermFields';
import styles from './BorrowForm.module.scss';
import { useBorrowForm } from './hooks';

interface BorrowFormProps {
  selectedNft: BorrowNft;
  isBulkLoan?: boolean;
  onDeselect?: () => void;
  onClick?: () => void;
  setLtvPercents?: (ltv: number) => void;
}

export enum BorrowFormTabs {
  PERPETUAL = 'perpetual',
  FLIP = 'flip',
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
  isBulkLoan,
  onClick,
  setLtvPercents,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    priceBasedLTV,
    setPriceBasedLTV,
    confirmText,
    priceBasedDisabled,
    borrowTabs,
    tabValue,
    setTabValue,
  } = useBorrowForm({
    onDeselect,
    selectedNft,
  });

  const borrowValue =
    tabValue === BorrowFormTabs.PERPETUAL
      ? (parseFloat(selectedNft?.valuation) * (priceBasedLTV / 100)).toFixed(3)
      : selectedNft?.timeBased?.loanValue;

  useEffect(() => {
    setLtvPercents(priceBasedLTV);
  }, [priceBasedLTV]);

  return (
    <>
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Loan Type</p>
        <Tabs
          className={styles.tabs}
          tabs={borrowTabs}
          value={tabValue}
          setValue={setTabValue}
        />
        {tabValue === BorrowFormTabs.FLIP && (
          <ShortTermFields nft={selectedNft} />
        )}
        {tabValue === BorrowFormTabs.PERPETUAL && !priceBasedDisabled && (
          <LongTermFields
            nft={selectedNft}
            ltv={priceBasedLTV}
            setLtv={setPriceBasedLTV}
          />
        )}
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={isBulkLoan ? onClick : openConfirmModal}
          type="secondary"
          className={styles.continueBtn}
        >
          {isBulkLoan ? 'View bulk loan' : `Quick borrow ${borrowValue}`}
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
      />
    </>
  );
};
