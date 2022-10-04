import { FC, useEffect, useState } from 'react';
import SwiperCore, { Navigation, Scrollbar } from 'swiper';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import Icons from '../../../../iconsNew/';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import { commonActions } from '../../../../state/common/actions';
import { BorrowNft } from '../../../../state/loans/types';
import styles from './Slider.module.scss';
import Button from '../../../Button';

SwiperCore.use([Navigation, Scrollbar]);

const sliderBreakpoints = {
  250: { slidesPerView: 4 },
};

interface SliderProps {
  nfts: BorrowNft[];
  onDeselect?: (nft: BorrowNft) => void;
  className?: string;
}

export const Slider: FC<SliderProps> = ({ onDeselect, nfts, className }) => {
  const dispatch = useDispatch();
  const selectedNftId = useSelector(selectSelectedNftId);

  const [currentId, setCurrentId] = useState(selectedNftId);

  const isBulkLoan = nfts.length > 1;
  const id = currentId > nfts.length - 1 ? 0 : selectedNftId;

  useEffect(() => {
    if (!nfts.length) {
      dispatch(commonActions.setSelectedNftId({ id: 0 }));
    }
  }, [selectedNftId, nfts]);

  useEffect(() => {
    if (currentId > nfts.length - 1) {
      dispatch(commonActions.setSelectedNftId({ id: 0 }));
    } else {
      dispatch(commonActions.setSelectedNftId({ id: currentId }));
    }
  }, [currentId]);

  const onNextNft = (idx: number): void => {
    if (idx > nfts.length - 1) {
      setCurrentId(0);
    } else {
      setCurrentId(idx);
    }
  };

  const onPrevNft = (idx: number): void => {
    if (idx < 0) {
      setCurrentId(nfts.length - 1);
    } else {
      setCurrentId(idx);
    }
  };

  return (
    <Swiper
      className={classNames(styles.nftSlider, className)}
      spaceBetween={18}
      breakpoints={sliderBreakpoints}
      navigation={true}
      scrollbar={{ draggable: true }}
    >
      {[nfts[id]].map((nft, idx) => (
        <>
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
                      onClick={() => onPrevNft(currentId - 1)}
                    >
                      <Icons.Chevron />
                    </Button>
                    <Button
                      className={classNames(styles.btn, styles.rotateRight)}
                      type="tertiary"
                      onClick={() => onNextNft(currentId + 1)}
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
        </>
      ))}
    </Swiper>
  );
};
