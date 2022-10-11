import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sum, map } from 'ramda';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import { getSelectedBulkValues } from './helpers';
import Button from '../../../../components/Button';
import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import { PATHS } from '../../../../constants';
import SidebarBulk from '../SidebarBulk';
import { useSeletedBulk } from './hooks';
import Header from '../Header';
import { loansActions } from '../../../../state/loans/actions';
interface BorrowingBulkProps {
  selectedBulk: any[];
  onClick?: () => void;
  onBack?: () => void;
}

const SelectedBulk: FC<BorrowingBulkProps> = ({
  selectedBulk: rawselectedBulk,
  onClick,
  onBack,
}) => {
  const {
    onSubmit,
    selectedBulk,
    loadingModalVisible,
    closeLoadingModal,
    feeOnDay,
  } = useSeletedBulk({ rawselectedBulk });

  const isSelectedBulk = !!selectedBulk?.length;

  const perpetualLoans = selectedBulk.filter((nft) => {
    return nft?.isPriceBased && nft?.priceBased;
  });

  const flipLoans = selectedBulk.filter((nft) => {
    return !nft?.priceBased || !nft?.isPriceBased;
  });

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const perpetualLoansValues = perpetualLoans.map(
    ({ priceBased, valuation }) => {
      if (priceBased?.ltv) {
        return Number(valuation) * (priceBased?.ltv / 100);
      } else {
        return priceBased?.suggestedLoanValue;
      }
    },
  );

  const priceBasedLoansValue = sum(perpetualLoansValues);

  const timeBasedLoansValue = sum(map(maxLoanValue, flipLoans));

  const totalBorrowed = priceBasedLoansValue + timeBasedLoansValue || 0;

  return (
    <>
      {isSelectedBulk && (
        <SidebarBulk
          onClick={onClick}
          onSubmit={onSubmit}
          onBack={onBack}
          selectedBulkValue={totalBorrowed}
          feeOnDay={feeOnDay}
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

        {!isSelectedBulk && (
          <div className={styles.congratsWrapper}>
            <h3 className={styles.congratsTitle}>
              Congrats! See your NFTs in My loans
            </h3>
            <NavLink to={PATHS.LOANS}>
              <Button className={styles.congratsBtn} type="secondary">
                Loans
              </Button>
            </NavLink>
          </div>
        )}

        {isSelectedBulk && (
          <div>
            {!!perpetualLoans.length && (
              <>
                <p className={styles.title}>Perpetual loans</p>
                {getPriceBasedValues(
                  perpetualLoans,
                  'perpetual',
                  onClick,
                  onBack,
                )}
              </>
            )}

            {!!flipLoans.length && (
              <>
                <p className={styles.title}>Flip loans</p>
                {getPriceBasedValues(flipLoans, 'flip', onClick, onBack)}
              </>
            )}
          </div>
        )}
      </div>
      <LoadingModal
        title="Please approve transaction"
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

const getPriceBasedValues = (loans, loansType, onClick, onBack) => {
  const dispatch = useDispatch();

  return loans.map((nft) => {
    const { imageUrl, name, valuation } = nft;

    const isPriceBasedLoan = loansType === 'perpetual';

    const {
      loanType,
      maxLoanValue,
      fee,
      loanToValue,
      BorrowAPY,
      liquidationsPrice,
      feeDiscountPercents,
      period,
      repayValue,
    } = getSelectedBulkValues(nft);

    return (
      <div className={styles.cardWrapper} key={nft.name}>
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <img className={styles.image} src={imageUrl} />
            <div className={styles.name}>{name}</div>
          </div>
          <p
            className={styles.editMode}
            onClick={() => {
              dispatch(loansActions.setCurrentNftLoan(nft));
              onBack ? onBack() : onClick();
            }}
          >
            Edit loan
          </p>
        </div>
        <div className={styles.hiddenValues}>
          {getStatsValue('Loan Type', loanType)}
          {getStatsValue('Loan to value', loanToValue, 'percent')}
          {getStatsValue('Floor price', valuation, 'number')}
          {getStatsValue('fee', fee, 'number')}
          {getStatsValue('To borrow', maxLoanValue, 'number')}
          {!isPriceBasedLoan && getStatsValue('Duration', `${period} DAYS`)}
          {isPriceBasedLoan &&
            getStatsValue('Liquidations price', liquidationsPrice, 'number')}
          {isPriceBasedLoan &&
            getStatsValue('Borrow APY', BorrowAPY, 'percent')}
          {!isPriceBasedLoan &&
            getStatsValue('Holder discount', feeDiscountPercents, 'percent')}
          {!isPriceBasedLoan && getStatsValue('To repay', repayValue, 'number')}
        </div>
      </div>
    );
  });
};
