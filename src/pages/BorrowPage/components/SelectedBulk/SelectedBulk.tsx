import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { filter } from 'ramda';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import { getSelectedBulkValues, getTotalBorrowed } from './helpers';
import { commonActions } from '../../../../state/common/actions';
import Button from '../../../../components/Button';
import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import { PATHS } from '../../../../constants';
import SidebarBulk from '../SidebarBulk';
import { useSeletedBulk } from './hooks';
import { BulkValues } from '../../hooks';
import Header from '../Header';

interface BorrowingBulkProps {
  selectedBulk: BulkValues[];
  onClick?: () => void;
  onBack?: () => void;
}

const SelectedBulk: FC<BorrowingBulkProps> = ({
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
  } = useSeletedBulk({ rawselectedBulk });

  const isSelectedBulk = !!selectedBulk?.length;

  const isPriceBased = (nft) => nft?.isPriceBased && nft?.priceBased;
  const isTimeBased = (nft) => !nft?.isPriceBased || !nft?.priceBased;

  const perpetualLoans = filter(isPriceBased, selectedBulk);
  const flipLoans = filter(isTimeBased, selectedBulk);

  const onEditLoan = (nft: BulkValues): void => {
    const selectedNftsMint = rawselectedBulk.map(({ mint }) => mint);
    const currentNftId = selectedNftsMint.indexOf(nft.mint);

    dispatch(commonActions.setSelectedNftId(currentNftId));
    onBack ? onBack() : onClick();
  };

  const totalBorrowed = getTotalBorrowed(perpetualLoans, flipLoans);

  return (
    <>
      {isSelectedBulk && (
        <SidebarBulk
          onClick={onClick}
          onSubmit={onSubmit}
          onBack={onBack}
          selectedBulkValue={totalBorrowed}
          feeOnDay={feesOnDay}
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
          <>
            {!!perpetualLoans.length &&
              getPriceBasedValues(perpetualLoans, 'perpetual', onEditLoan)}

            {!!flipLoans.length &&
              getPriceBasedValues(flipLoans, 'flip', onEditLoan)}
          </>
        )}
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
  loans: BulkValues[],
  loansType: string,
  onEditLoan: (nft: BulkValues) => void,
) => {
  const isPriceBasedLoan = loansType === 'perpetual';

  return (
    <>
      <p className={styles.title}>
        {isPriceBasedLoan ? 'Perpetual loans' : 'Flip loans'}
      </p>
      {loans.map((nft) => {
        const { imageUrl, name, valuation } = nft;

        const {
          loanType,
          maxLoanValue,
          loanToValue,
          BorrowAPY,
          liquidationsPrice,
          feeDiscountPercents,
          period,
          repayValue,
        } = getSelectedBulkValues(nft);

        const fee = (Number(maxLoanValue) * 0.01).toFixed(3);

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
              {getStatsValue('Loan Type', loanType)}
              {getStatsValue('Loan to value', loanToValue, 'percent')}
              {getStatsValue('Floor price', valuation, 'number')}
              {getStatsValue('fee', fee, 'number')}
              {getStatsValue('To borrow', maxLoanValue, 'number')}
              {!isPriceBasedLoan && getStatsValue('Duration', `${period} DAYS`)}
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
