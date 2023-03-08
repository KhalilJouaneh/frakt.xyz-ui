import { FC } from 'react';
import { MOCK_IMAGES } from '../../mock';

import styles from './NoConnectedMyLoans.module.scss';

interface NoConnectedMyLoansProps {
  restFlipPoolImages: number;
}

const NoConnectedMyLoans: FC<NoConnectedMyLoansProps> = ({
  restFlipPoolImages,
}) => {
  const [firstRowImages, secondRowImages, lastImage] = [
    MOCK_IMAGES.slice(0, 4),
    MOCK_IMAGES.slice(4, 8),
    MOCK_IMAGES.at(-1),
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
            <div className={styles.columm}>
              {secondRowImages.slice(0, 2).map((image, idx) => (
                <img key={idx} className={styles.image} src={image} />
              ))}
            </div>
            <div className={styles.columm}>
              {secondRowImages.slice(2, 4).map((image, idx) => (
                <img key={idx} className={styles.image} src={image} />
              ))}
            </div>
          </div>
          <div className={styles.poolImageEmpty}>
            <img className={styles.poolImage} src={lastImage} />
            <div className={styles.otherImage}>
              <p className={styles.otherImageCount}>
                +{restFlipPoolImages || 0}
              </p>
              <p className={styles.otherImageTitle}>collections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoConnectedMyLoans;
