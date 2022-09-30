import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import Button from '../../../../components/Button';
import styles from './SelectedBulkRaw.module.scss';
import { SolanaIcon } from '../../../../icons';
import { BulkValues } from '../../BorrowPage';
import { PATHS } from '../../../../constants';
import { useSeletedBulkRaw } from './hooks';
import Icons from '../../../../iconsNew';

interface SelectedBulkRawProps {
  selectedBulk: BulkValues[];
  onClick: () => void;
  selectedBulkValue: number;
  onChangeAssetsMode: () => void;
}

const SelectedBulkRaw: FC<SelectedBulkRawProps> = ({
  selectedBulk: rawselectedBulk,
  onClick,
  selectedBulkValue,
  onChangeAssetsMode,
}) => {
  const {
    onSubmit,
    onCardClick,
    selectedBulk,
    loadingModalVisible,
    setLoadingModalVisible,
    getLiquidationPrice,
    activeCardId,
  } = useSeletedBulkRaw({ rawselectedBulk });

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
                Bulk borrow {selectedBulkValue?.toFixed(2)} SOL
              </Button>
              <Button onClick={onChangeAssetsMode} className={styles.btn}>
                Change asset
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
            <h1 className={styles.title}>Tiltle 1</h1>
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
          selectedBulk.map((nft, id) => (
            <div className={styles.cardWrapper} key={id}>
              <div className={styles.card}>
                <div className={styles.cardInfo}>
                  <img className={styles.image} src={nft?.imageUrl} />
                  <div className={styles.name}>{nft?.name || ''}</div>
                </div>
                <div className={styles.cardValues}>
                  {getStatsValue({
                    title: 'To borrow',
                    value: nft?.maxLoanValue,
                    withIcon: true,
                    className: styles.rowCardValue,
                  })}
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
                  {getStatsValue({
                    title: 'Loan Type',
                    value: nft?.isPriceBased ? 'Perpetual' : 'Flip',
                  })}
                  {getStatsValue({
                    title: 'Loan to value',
                    value: `${nft?.parameters?.ltvPercents} %`,
                  })}
                  {getStatsValue({
                    title: 'Floor price',
                    value: `${nft?.valuation}`,
                    withIcon: true,
                  })}
                  {nft?.isPriceBased &&
                    getStatsValue({
                      title: 'Liquidations price',
                      value: `${getLiquidationPrice(nft)}`,
                      withIcon: true,
                    })}
                  {nft?.isPriceBased &&
                    getStatsValue({
                      title: 'Borrow APY',
                      value: `${nft?.parameters?.borrowAPRPercents?.toFixed(
                        0,
                      )} %`,
                    })}
                  {getStatsValue({
                    title: 'Minting fee',
                    value: `${
                      nft?.isPriceBased
                        ? (Number(nft.maxLoanValue) * 0.01).toFixed(3)
                        : nft.parameters?.fee
                    } `,
                    withIcon: true,
                  })}
                </div>
              )}
            </div>
          ))}
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={() => setLoadingModalVisible(false)}
      />
    </>
  );
};

export default SelectedBulkRaw;

const getStatsValue = ({
  title,
  value,
  withIcon,
  className,
}: {
  title: string;
  value: number | string;
  withIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className={cx(styles.cardValue, className)}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {withIcon && <SolanaIcon />}
      </p>
    </div>
  );
};
