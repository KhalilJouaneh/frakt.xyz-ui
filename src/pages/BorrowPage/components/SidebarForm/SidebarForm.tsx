import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import cx from 'classnames';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import { commonActions } from '../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import { BorrowNft } from '../../../../state/loans/types';
import Button from '../../../../components/Button';
import styles from './SidebarForm.module.scss';
import Icons from '../../../../iconsNew/';
import { BulkValues } from '../../hooks';
import BorrowForm from '../BorrowForm';

export interface SidebarFormProps {
  onDeselect?: (nft?: BorrowNft) => void;
  nfts: BorrowNft[];
  isCloseSidebar: boolean;
  className?: string;
  bulkNfts: BulkValues[];
  onOpenBulk: () => void;
  setTab: (tab: string) => void;
  setLtv: (ltv: number) => void;
}

const SidebarForm: FC<SidebarFormProps> = ({
  onDeselect,
  nfts,
  className,
  isCloseSidebar = false,
  bulkNfts,
  onOpenBulk,
  setTab,
  setLtv,
}) => {
  const isSidebarVisible = !!nfts.length;
  const totalNftsId = nfts.length - 1;
  const isBulkLoan = nfts.length > 1;

  const dispatch = useDispatch();

  const currentNftId = useSelector(selectSelectedNftId);

  const id = currentNftId > totalNftsId ? 0 : currentNftId;

  const [priceBasedLTV, getLtv] = useState<number>(0);
  const [tabValue, getTab] = useState<string>('');

  const selectedNft = bulkNfts?.[id];

  useEffect(() => {
    setTab(tabValue);
    setLtv(priceBasedLTV);
  }, [tabValue, priceBasedLTV]);

  const updateCurrentNft = (selectedNft) => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: selectedNft?.mint,
          ltv: priceBasedLTV,
          formType: tabValue,
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
          )}
        >
          <div className={styles.sidebar}>
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
                          {Icons.Cross()}
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
                        {Icons.Cross()}
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
                getLtv={getLtv}
                getTab={getTab}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarForm;
