import { FC } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import { getSelectedBulkValues, getTotalBorrowed } from './helpers';
import { commonActions } from '../../../../state/common/actions';
import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import SuccessLoan from '../SuccessLoan';
import SidebarBulk from '../SidebarBulk';
import { useSeletedBulk } from './hooks';
import Header from '../Header';
import { BorrowNftBulk } from '@frakt/api/nft';

interface SelectedBulkProps {
  selectedBulk: BorrowNftBulk[];
  onClick?: () => void;
  onBack?: () => void;
}

const SelectedBulk: FC<SelectedBulkProps> = ({
  selectedBulk: rawselectedBulk,
  onClick,
  onBack,
}) => {
  const dispatch = useDispatch();

  const {
    onSubmit,
    selectedBulk,
    loadingModalVisible,
    closeLoadingModal,
    feesOnDay,
    feesOnMaxDuration,
    isMaxReturnPeriodDays,
  } = useSeletedBulk({ rawselectedBulk });

  const isSelectedBulk = !!selectedBulk?.length;

  const onEditLoan = (nft: BorrowNftBulk): void => {
    const selectedNftsMint = rawselectedBulk.map(({ mint }) => mint);
    const currentNftId = selectedNftsMint.indexOf(nft.mint);

    dispatch(commonActions.setSelectedNftId(currentNftId));
    onBack ? onBack() : onClick();
  };

  const totalBorrowed = getTotalBorrowed(rawselectedBulk);

  return (
    <>
      {isSelectedBulk && (
        <SidebarBulk
          onClick={onClick}
          onSubmit={onSubmit}
          onBack={onBack}
          selectedBulkValue={totalBorrowed}
          feeOnDay={feesOnDay}
          isMaxReturnPeriodDays={isMaxReturnPeriodDays}
          feesOnMaxDuration={feesOnMaxDuration}
        />
      )}

      <div
        className={cx(
          styles.container,
          !isSelectedBulk && styles.closeContainer,
        )}
      >
        <Header
          onClick={onClick}
          title="Borrowing"
          subtitle={`${selectedBulk?.length} loans in bulk`}
        />

        {!isSelectedBulk && <SuccessLoan />}

        {isSelectedBulk && getPriceBasedValues(rawselectedBulk, onEditLoan)}
      </div>
      <LoadingModal
        title="Please approve transaction"
        subtitle="In order to transfer the NFT/s approval is needed"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};

export default SelectedBulk;

const getStatsValue = (
  title: string,
  value: number | string,
  type?: 'percent' | 'number',
  className?: string,
) => {
  const number = type === 'number' && <SolanaIcon />;
  const percent = type === 'percent' && '%';

  return (
    <div className={cx(styles.cardValue, className)}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {number || percent || null}
      </p>
    </div>
  );
};

const getPriceBasedValues = (
  loans: BorrowNftBulk[],
  onEditLoan: (nft: BorrowNftBulk) => void,
) => {
  return (
    <>
      {loans.map((nft) => {
        const isPriceBasedLoan = nft.isPriceBased;

        const { imageUrl, name, valuation } = nft;

        const {
          maxLoanValue,
          loanToValue,
          BorrowAPY,
          liquidationsPrice,
          feeDiscountPercents,
          period,
          repayValue,
          fee,
        } = getSelectedBulkValues(nft);

        const feeName = isPriceBasedLoan ? 'Upfront fee' : 'fee';

        return (
          <div className={styles.cardWrapper} key={nft.name}>
            <div className={styles.card}>
              <div className={styles.cardInfo}>
                <img className={styles.image} src={imageUrl} />
                <div className={styles.name}>{name}</div>
              </div>
              <p className={styles.editMode} onClick={() => onEditLoan(nft)}>
                Edit loan
              </p>
            </div>
            <div className={styles.hiddenValues}>
              {getStatsValue('Loan to value', loanToValue, 'percent')}
              {getStatsValue('Floor price', valuation, 'number')}
              {getStatsValue(feeName, fee, 'number')}
              {getStatsValue('To borrow', maxLoanValue, 'number')}
              {getStatsValue(
                'Duration',
                `${isPriceBasedLoan ? `Perpetual` : `${period} days`}`,
              )}
              {isPriceBasedLoan &&
                getStatsValue(
                  'Liquidations price',
                  liquidationsPrice,
                  'number',
                )}
              {isPriceBasedLoan &&
                getStatsValue('Borrow APY', BorrowAPY, 'percent')}
              {!isPriceBasedLoan &&
                getStatsValue(
                  'Holder discount',
                  feeDiscountPercents,
                  'percent',
                )}
              {!isPriceBasedLoan &&
                getStatsValue('To repay', repayValue, 'number')}
            </div>
          </div>
        );
      })}
    </>
  );
};
