import { FC } from 'react';

import styles from './NoConnectedMyLoans.module.scss';

interface NoConnectedMyLoansProps {
  poolsImages: string[];
  restFlipPoolImages: number;
}

const NoConnectedMyLoans: FC<NoConnectedMyLoansProps> = ({
  poolsImages,
  restFlipPoolImages,
}) => {
  const [firstRowImages, secondRowImages] = [
    poolsImages.slice(0, 4),
    poolsImages.slice(4, 8),
  ];

  return (
    <div className={styles.emptyContent}>
      <p className={styles.emptyMessage}>
        Pick NFTs to be used as collateral or ask our algorithm to get you the
        exact amount of SOL that you need
      </p>
      <div className={styles.wrapper}>
        <div className={styles.row}>
          {firstRowImages.map((image, idx) => (
            <img key={idx} className={styles.image} src={image} />
          ))}
        </div>
        <div className={styles.row}>
          <div className={styles.images}>
            {secondRowImages.map((image, idx) => (
              <img key={idx} className={styles.image} src={image} />
            ))}
          </div>
          <div className={styles.poolImageEmpty}>
            <img src={firstRowImages[0]} />
            <div className={styles.otherImage}>
              <p className={styles.otherImageCount}>+{restFlipPoolImages}</p>
              <p className={styles.otherImageTitle}>collections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoConnectedMyLoans;
