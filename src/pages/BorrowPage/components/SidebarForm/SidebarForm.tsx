import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sum } from 'ramda';
import cx from 'classnames';

import { BorrowNft } from '@frakt/api/nft';
import { selectSelectedNftId } from '../../../../state/common/selectors';
import { commonActions } from '../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import Button from '../../../../components/Button';
import styles from './SidebarForm.module.scss';
import Icons from '../../../../iconsNew/';
import { BorrowNftBulk } from '../../hooks';
import BorrowForm from '../BorrowForm';
import { selectCurrentLoanNft } from '../../../../state/loans/selectors';

export interface SidebarFormProps {
  onDeselect?: (nft?: BorrowNft) => void;
  nfts: BorrowNft[];
  isCloseSidebar: boolean;
  className?: string;
  bulkNfts: BorrowNftBulk[];
  onOpenBulk: () => void;
}

const SidebarForm: FC<SidebarFormProps> = ({
  onDeselect,
  nfts,
  className,
  isCloseSidebar = false,
  bulkNfts,
  onOpenBulk,
}) => {
  const isSidebarVisible = !!nfts.length;
  const totalNftsId = nfts.length - 1;
  const isBulkLoan = nfts.length > 1;

  const dispatch = useDispatch();

  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;

  const currentNftId = useSelector(selectSelectedNftId);

  const id = currentNftId > totalNftsId ? 0 : currentNftId;

  const [visible, setVisible] = useState<boolean>(false);

  const selectedNft = bulkNfts?.[id];

  const totalBorrowed = sum(
    bulkNfts.map((nft) => {
      if (nft.mint === currentLoanNft.mint) {
        return currentLoanNft.solLoanValue;
      } else {
        return nft?.solLoanValue;
      }
    }),
  );

  const updateCurrentNft = (selectedNft) => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: currentLoanNft.mint,
          solLoanValue: currentLoanNft.solLoanValue,
          ltv: currentLoanNft.ltv,
          type: currentLoanNft.type,
        }),
      );
    }
  };

  const onNextNft = (idx: number): void => {
    updateCurrentNft(selectedNft);
    if (idx > totalNftsId) {
      dispatch(commonActions.setSelectedNftId(0));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  const onPrevNft = (idx: number): void => {
    updateCurrentNft(selectedNft);

    if (idx < 0) {
      dispatch(commonActions.setSelectedNftId(totalNftsId));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  const SliderButtons = () => {
    return (
      <div className={styles.btnWrapper}>
        <Button
          className={cx(styles.btn, styles.rotateLeft)}
          type="tertiary"
          onClick={() => onPrevNft(currentNftId - 1)}
        >
          <Icons.Chevron />
        </Button>
        <Button
          className={cx(styles.btn, styles.rotateRight)}
          type="tertiary"
          onClick={() => onNextNft(currentNftId + 1)}
        >
          <Icons.Chevron />
        </Button>
      </div>
    );
  };

  return (
    <>
      {!isCloseSidebar && (
        <div
          className={cx(
            styles.sidebarWrapper,
            isSidebarVisible && styles.visible,
            visible && styles.collapsedSidebar,
          )}
        >
          {isSidebarVisible && (
            <div className={styles.dropdown}>
              <Button
                className={cx(styles.btn, visible && styles.rotateUp)}
                type="tertiary"
                onClick={() => setVisible(!visible)}
              >
                <Icons.Chevron />
              </Button>
            </div>
          )}
          <div
            className={cx(
              styles.collapsedContent,
              visible && styles.collapsedContentVisible,
            )}
          >
            <Button
              onClick={onOpenBulk}
              type="secondary"
              className={styles.collapsedBtn}
            >
              View bulk loan {totalBorrowed.toFixed(2)} SOL
            </Button>
          </div>
          <div className={cx(styles.sidebar, visible && styles.sidebarHidden)}>
            <Swiper className={cx(styles.nftSlider, className)}>
              {[selectedNft].map((nft, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <div className={styles.slide}>
                      <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${nft?.imageUrl})` }}
                      >
                        <button
                          className={styles.removeBtn}
                          onClick={() => onDeselect(nft)}
                        >
                          <Icons.Trash />
                        </button>
                        {isBulkLoan && <SliderButtons />}
                      </div>
                      <p className={styles.nftName}>{nft?.name}</p>
                    </div>

                    <div className={styles.mobileSlide}>
                      <div className={styles.mobileSlideInfo}>
                        <div
                          className={styles.image}
                          style={{ backgroundImage: `url(${nft?.imageUrl})` }}
                        />
                        <p className={styles.nftName}>{nft?.name}</p>
                      </div>
                      <button
                        className={styles.removeBtnMobile}
                        onClick={() => onDeselect(nft)}
                      >
                        <Icons.Trash />
                      </button>
                      {isBulkLoan && <SliderButtons />}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {isSidebarVisible && (
              <BorrowForm
                onClick={onOpenBulk}
                selectedNft={selectedNft}
                isBulkLoan={isBulkLoan}
                onDeselect={onDeselect}
                totalBorrowed={totalBorrowed}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarForm;
