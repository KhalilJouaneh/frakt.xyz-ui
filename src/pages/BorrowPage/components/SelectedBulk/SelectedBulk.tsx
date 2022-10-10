import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import { getSelectedBulkValues } from './helpers';
import Button from '../../../../components/Button';
import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import { PATHS } from '../../../../constants';
import SidebarBulk from '../SidebarBulk';
import { useSeletedBulk } from './hooks';
import Icons from '../../../../iconsNew';
import Header from '../Header';

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
    feeOnDay,
  } = useSeletedBulk({ rawselectedBulk });

  const isSelectedBulk = !!selectedBulk?.length;

  return (
    <>
      {isSelectedBulk && (
        <SidebarBulk
          onClick={onClick}
          onSubmit={onSubmit}
          onBack={onBack}
          selectedBulkValue={selectedBulkValue}
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

        {isSelectedBulk &&
          selectedBulk.map((nft, id) => {
            const { imageUrl, name, isPriceBased, valuation } = nft;

            const {
              loanType,
              maxLoanValue,
              fee,
              loanToValue,
              BorrowAPY,
              liquidationsPrice,
            } = getSelectedBulkValues(nft);

            return (
              <div className={styles.cardWrapper} key={nft.name}>
                <div className={styles.card}>
                  <div className={styles.cardInfo}>
                    <img className={styles.image} src={imageUrl} />
                    <div className={styles.name}>{name}</div>
                  </div>
                  <div className={styles.cardValues}>
                    {getStatsValue(
                      'To borrow',
                      maxLoanValue,
                      'number',
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
                    {getStatsValue('Loan to value', loanToValue, 'percent')}
                    {getStatsValue('Floor price', valuation, 'number')}
                    {isPriceBased &&
                      getStatsValue(
                        'Liquidations price',
                        liquidationsPrice,
                        'number',
                      )}
                    {isPriceBased &&
                      getStatsValue('Borrow APY', BorrowAPY, 'percent')}
                    {getStatsValue('fee', fee, 'number')}
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
