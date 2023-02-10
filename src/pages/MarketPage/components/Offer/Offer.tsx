import { FC } from 'react';
import classNames from 'classnames';

import { Trash } from '@frakt/icons';
import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';

import { MarketOrder } from '../OrderBook/types';
import styles from './Offer.module.scss';

interface OfferProps {
  order: MarketOrder;
  bestOffer: MarketOrder;
  isOwnOrder: boolean;
  editOrder?: () => void;
  ltv: number;
  size: number;
  interest: number;
}

const Offer: FC<OfferProps> = ({
  order,
  bestOffer,
  isOwnOrder,
  editOrder,
  ltv,
  size,
  interest,
}) => {
  const colorLTV = getColorByPercent(ltv, colorByPercentOffers);

  return (
    <li
      className={classNames(styles.listItem, {
        [styles.highlightBest]:
          interest === bestOffer?.interest && size === bestOffer?.size,
        [styles.highlightYourOffer]: order.synthetic,
      })}
    >
      <div
        className={styles.ltv}
        style={{
          background: `${colorLTV}`,
          left: ltv <= 27 ? `${ltv}%` : `calc(${ltv}%  - 74px)`,
        }}
      >
        ltv: {`${ltv}%`}
      </div>
      <div
        className={styles.line}
        style={{
          left: ltv <= 27 ? `${ltv}%` : `calc(${ltv}%  - 4px)`,
          borderColor: `${colorLTV}`,
        }}
      ></div>
      <div className={styles.valueWrapper}>
        <div className={styles.value}>{size?.toFixed(3)}</div>
        <div className={styles.value}>{(interest * 100)?.toFixed(2)}%</div>
      </div>
      {isOwnOrder && editOrder && (
        <div
          className={classNames(styles.roundBtn, styles.btnTrash)}
          onClick={editOrder}
        >
          <Trash />
        </div>
      )}
    </li>
  );
};

export default Offer;
