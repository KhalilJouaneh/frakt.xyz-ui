import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import cx from 'classnames';

import SliderButtons from '../SliderButtons';
import styles from './Slider.module.scss';
import { Trash } from '@frakt/icons';

interface SliderProps {
  nfts: any;
  onDeselect: (nft: any) => void;
  onPrev?: () => void;
  onNext?: () => void;
  isBulkLoan: boolean;
}

const DeleteButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button className={cx(styles.removeBtn, className)} onClick={onClick}>
      <Trash />
    </button>
  );
};

const Slider: FC<SliderProps> = ({
  nfts,
  onDeselect,
  onPrev,
  onNext,
  isBulkLoan,
}) => {
  return (
    <Swiper className={styles.nftSlider}>
      {[nfts].map((nft, idx) => {
        const nftName = nft?.name;
        const imageUrl = nft?.imageUrl;

        return (
          <SwiperSlide key={idx}>
            <div className={styles.slide}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <DeleteButton onClick={() => onDeselect(nft)} />
                {isBulkLoan && (
                  <SliderButtons onPrev={onPrev} onNext={onNext} />
                )}
              </div>
              <p className={styles.nftName}>{nftName}</p>
            </div>

            <div className={styles.mobileSlide}>
              <div className={styles.mobileSlideInfo}>
                <div
                  className={styles.image}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <p className={styles.nftName}>{nftName}</p>
              </div>
              <DeleteButton
                className={styles.removeBtnMobile}
                onClick={() => onDeselect(nft)}
              />
              {isBulkLoan && <SliderButtons onPrev={onPrev} onNext={onNext} />}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;
