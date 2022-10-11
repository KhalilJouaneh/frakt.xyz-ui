import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import cx from 'classnames';

import { selectCurrentNft } from '../../../../state/loans/selectors';
import { loansActions } from '../../../../state/loans/actions';
import { BorrowNft } from '../../../../state/loans/types';
import Button from '../../../../components/Button';
import styles from './SidebarForm.module.scss';
import Icons from '../../../../iconsNew/';
import BorrowForm from '../BorrowForm';

export interface SidebarFormProps {
  onDeselect?: (nft?: BorrowNft) => void;
  nfts: BorrowNft[];
  isCloseSidebar: boolean;
  className?: string;
  bulkNfts: any;
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

  const currentNft = useSelector(selectCurrentNft);
  const dispatch = useDispatch();

  const [rawId, setId] = useState<number>(0);

  const id = rawId > totalNftsId ? 0 : rawId;

  const [priceBasedLTV, getLtv] = useState<number>(0);
  const [tabValue, getTab] = useState<number>(0);

  const selectedNft = currentNft?.name ? currentNft : bulkNfts?.[id];

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
    dispatch(loansActions.setCurrentNftLoan(null));
    if (idx > totalNftsId) {
      setId(0);
    } else {
      setId(idx);
    }
  };

  useEffect(() => {
    if (nfts.length) {
      updateCurrentNft(selectedNft);
      setId(totalNftsId);
    } else {
      dispatch(loansActions.updatePerpLoanNft([]));
      dispatch(loansActions.setCurrentNftLoan(null));
    }
  }, [nfts.length]);

  const onPrevNft = (idx: number): void => {
    updateCurrentNft(selectedNft);

    dispatch(loansActions.setCurrentNftLoan(null));

    if (idx < 0) {
      setId(totalNftsId);
    } else {
      setId(idx);
    }
  };

  return (
    <>
      {!isCloseSidebar && (
        <div
          className={cx([
            styles.sidebarWrapper,
            { [styles.visible]: isSidebarVisible },
          ])}
        >
          <div className={styles.sidebar}>
            <Swiper className={cx(styles.nftSlider, className)}>
              {[selectedNft].map((nft, idx) => (
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
                      {isBulkLoan && (
                        <div className={styles.btnWrapper}>
                          <Button
                            className={cx(styles.btn, styles.rotateLeft)}
                            type="tertiary"
                            onClick={() => onPrevNft(rawId - 1)}
                          >
                            <Icons.Chevron />
                          </Button>
                          <Button
                            className={cx(styles.btn, styles.rotateRight)}
                            type="tertiary"
                            onClick={() => onNextNft(rawId + 1)}
                          >
                            <Icons.Chevron />
                          </Button>
                        </div>
                      )}
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
                  </div>
                </SwiperSlide>
              ))}
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
