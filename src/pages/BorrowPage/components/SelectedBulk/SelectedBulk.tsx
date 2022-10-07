import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import Button from '../../../../components/Button';
import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import { PATHS } from '../../../../constants';
import { useSeletedBulk } from './hooks';
import Icons from '../../../../iconsNew';

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
    onCardClick,
    selectedBulk,
    loadingModalVisible,
    activeCardId,
    selectedBulkValue,
    closeLoadingModal,
  } = useSeletedBulk({ rawselectedBulk });

  const isSelectedBulk = selectedBulk?.length;

  return (
    <>
      {!!isSelectedBulk && (
        <>
          <div
            onClick={onClick}
            className={cx(styles.btnBack, styles.btnWithArrow)}
          >
            <Icons.Arrow />
          </div>
          <div className={styles.sidebar}>
            <p className={styles.sidebarTitle}>To borrow</p>
            <p className={styles.sidebarSubtitle}>
              {selectedBulkValue?.toFixed(2)} SOL
            </p>
            <div className={styles.sidebarBtnWrapper}>
              <Button
                onClick={onSubmit}
                type="secondary"
                className={styles.btn}
              >
                Borrow {selectedBulkValue?.toFixed(2)} SOL
              </Button>
              <Button
                onClick={onBack ? onBack : onClick}
                className={styles.btn}
              >
                Change assets
              </Button>
            </div>
          </div>
        </>
      )}

      <div
        className={cx(
          styles.container,
          !isSelectedBulk && styles.closeContainer,
        )}
      >
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Borrowing</h1>
            <h2 className={styles.subtitle}>
              {selectedBulk?.length} loans in bulk
            </h2>
          </div>
        </div>

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

        {!!isSelectedBulk &&
          selectedBulk.map((nft, id) => {
            const {
              imageUrl,
              name,
              maxLoanValue,
              isPriceBased,
              priceBased,
              timeBased,
              valuation,
            } = nft;

            const loanType = isPriceBased ? 'Perpetual' : 'Flip';

            const timeBasedFee =
              Number(timeBased.fee) *
              (Number(timeBased?.feeDiscountPercents) * 0.01);

            const fee = isPriceBased
              ? Number(maxLoanValue) * 0.01
              : timeBasedFee;

            const loanToValue = isPriceBased
              ? priceBased?.ltv || priceBased?.ltvPercents
              : timeBased?.ltvPercents;

            const BorrowAPY = priceBased?.borrowAPRPercents?.toFixed(0);

            const loanValue =
              parseFloat(valuation) * (priceBased?.ltvPercents / 100);

            const liquidationsPrice =
              loanValue + loanValue * (priceBased?.collaterizationRate / 100);

            return (
              <div className={styles.cardWrapper} key={id}>
                <div className={styles.card}>
                  <div className={styles.cardInfo}>
                    <img className={styles.image} src={imageUrl} />
                    <div className={styles.name}>{name}</div>
                  </div>
                  <div className={styles.cardValues}>
                    {getStatsValue(
                      'To borrow',
                      maxLoanValue,
                      true,
                      styles.rowCardValue,
                    )}
                    <div
                      onClick={() => onCardClick(id)}
                      className={cx(
                        activeCardId === id && styles.btnVisible,
                        styles.btnWithArrow,
                      )}
                    >
                      <Icons.Chevron />
                    </div>
                  </div>
                </div>
                {id === activeCardId && (
                  <div className={styles.hiddenValues}>
                    {getStatsValue('Loan Type', loanType)}
                    {getStatsValue('Loan to value', `${loanToValue} %`)}
                    {getStatsValue('Floor price', `${valuation}`, true)}
                    {isPriceBased &&
                      getStatsValue(
                        'Liquidations price',
                        `${liquidationsPrice.toFixed(3)}`,
                        true,
                      )}
                    {isPriceBased &&
                      getStatsValue('Borrow APY', `${BorrowAPY} %`)}
                    {getStatsValue('fee', `${fee.toFixed(3)}`, true)}
                  </div>
                )}
              </div>
            );
          })}
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
  withIcon?: boolean,
  className?: string,
) => {
  return (
    <div className={cx(styles.cardValue, className)}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {withIcon && <SolanaIcon />}
      </p>
    </div>
  );
};
