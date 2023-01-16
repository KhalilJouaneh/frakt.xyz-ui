import { FC } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { ConfirmModal } from '@frakt/components/ConfirmModal';
import { Solana } from '@frakt/icons';
import { BorrowNftBulk } from '@frakt/api/nft';
import { LoadingModal } from '@frakt/components/LoadingModal';

import { BorrowHeader } from '../components/BorrowHeader';
import { OverviewSidebar } from './components/OverviewSidebar';
import styles from './BorrowBulkOverviewPage.module.scss';
import { getLoanFields } from './helpers';
import { CARD_VALUES_TYPES } from './types';
import { useBorrowBulkOverviewPage } from './hooks';

export const BorrowBulkOverviewPage: FC = () => {
  const {
    selection,
    onBackBtnClick,
    onBorrow,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
  } = useBorrowBulkOverviewPage();

  return (
    <AppLayout>
      <OverviewSidebar
        bulkSelection={selection}
        onChangeAssets={() => {}}
        onBorrow={openConfirmModal}
      />

      <div
        className={classNames(
          styles.container,
          !selection.length && styles.closeContainer,
        )}
      >
        <BorrowHeader
          onBackBtnClick={onBackBtnClick}
          title="Borrowing"
          subtitle={`${selection?.length} loans in bulk`}
        />
        {selection.map((nft) => (
          <LoanCard key={nft.mint} nft={nft} onEditClick={() => {}} />
        ))}
      </div>
      <LoadingModal
        title="Please approve transaction"
        subtitle="In order to transfer the NFT/s approval is needed"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={onBorrow}
        title="Please confirm"
        subtitle={`You are about to confirm the transaction to borrow bulk loan.
          Want to proceed?
        `}
        btnAgree="Let's go"
      />
    </AppLayout>
  );
};

interface LoanCardprops {
  nft: BorrowNftBulk;
  onEditClick: () => void;
}
const LoanCard: FC<LoanCardprops> = ({ nft, onEditClick }) => {
  const { imageUrl, name } = nft;

  const fields = getLoanFields(nft);

  return (
    <div className={styles.cardWrapper} key={nft.name}>
      <div className={styles.card}>
        <div className={styles.cardInfo}>
          <img className={styles.image} src={imageUrl} />
          <div className={styles.name}>{name}</div>
        </div>
        <p className={styles.editMode} onClick={onEditClick}>
          Edit loan
        </p>
      </div>
      <div className={styles.hiddenValues}>
        {fields.map(({ title, value, valueType }, idx) => (
          <LoanCardValue
            key={idx}
            title={title}
            value={value}
            valueType={valueType}
          />
        ))}
      </div>
    </div>
  );
};

interface LoanCardValue {
  title: string;
  value: number | string;
  valueType?: CARD_VALUES_TYPES;
}
const LoanCardValue: FC<LoanCardValue> = ({
  title,
  value,
  valueType = CARD_VALUES_TYPES.string,
}) => {
  const DIMENSTION_BY_VALUE_TYPE: Record<CARD_VALUES_TYPES, JSX.Element> = {
    [CARD_VALUES_TYPES.string]: null,
    [CARD_VALUES_TYPES.percent]: <>{'%'}</>,
    [CARD_VALUES_TYPES.solPrice]: <Solana />,
  };

  return (
    <div className={styles.cardValue}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {DIMENSTION_BY_VALUE_TYPE[valueType]}
      </p>
    </div>
  );
};
