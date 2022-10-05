import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import { commonActions } from '../../../../state/common/actions';
import { BorrowNft } from '../../../../state/loans/types';
import styles from './Slider.module.scss';
import Icons from '../../../../iconsNew/';
import Button from '../../../Button';

interface SliderProps {
  nfts: BorrowNft[];
  onDeselect?: (nft: BorrowNft) => void;
  className?: string;
}

export const Slider: FC<SliderProps> = ({ onDeselect, nfts, className }) => {
  const dispatch = useDispatch();

  const selectedNftId = useSelector(selectSelectedNftId);

  const totalNftsId = nfts.length - 1;

  const isBulkLoan = nfts.length > 1;
  const id = selectedNftId > totalNftsId ? 0 : selectedNftId;

  const onNextNft = (idx: number): void => {
    if (idx > totalNftsId) {
      dispatch(commonActions.setSelectedNftId(0));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  const onPrevNft = (idx: number): void => {
    if (idx < 0) {
      dispatch(commonActions.setSelectedNftId(totalNftsId));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  return (
    <Swiper className={classNames(styles.nftSlider, className)}>
      {[nfts[id]].map((nft, idx) => (
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
                    className={classNames(styles.btn, styles.rotateLeft)}
                    type="tertiary"
                    onClick={() => onPrevNft(selectedNftId - 1)}
                  >
                    <Icons.Chevron />
                  </Button>
                  <Button
                    className={classNames(styles.btn, styles.rotateRight)}
                    type="tertiary"
                    onClick={() => onNextNft(selectedNftId + 1)}
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
  );
};
