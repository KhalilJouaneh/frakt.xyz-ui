import { FC } from 'react';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { ShortTermFields } from '../ShortTermFields';
import Button from '../../../../components/Button';
import { Radio } from '../../../../components/Radio';
import LongTermFields from '../LongTermFields';
import styles from './BorrowForm.module.scss';
import { FormFieldTypes, useBorrowForm } from './hooks';
import { BorrowNft } from '../../../../state/loans/types';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import { Tabs } from '../../../../components/Tabs';

interface BorrowFormProps {
  selectedNft: BorrowNft;
  onDeselect?: () => void;
}

export enum BorrowFormTabs {
  PERPETUAL = 'perpetual',
  FLIP = 'flip',
}

export const BorrowForm: FC<BorrowFormProps> = ({
  selectedNft,
  onDeselect,
}) => {
  const {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    formField,
    setFormField,
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
          onClick={openConfirmModal}
          type="secondary"
          className={styles.continueBtn}
        >
          Borrow
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
