import { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { colorByPercentOffers, getColorByPercent } from '@frakt/utils/bonds';
import { MarketOrder } from '../OrderBook/types';
import { Trash } from '@frakt/iconsNew/Trash';
import styles from './Offer.module.scss';

interface OfferProps {
  order: MarketOrder;
  isBestOffer: MarketOrder;
  isOwnOrder: (order: MarketOrder) => boolean;
  removeOrder: (order: MarketOrder) => MouseEventHandler<HTMLDivElement>;
  ltv: number;
  size: number;
  interest: number;
}

const Offer: FC<OfferProps> = ({
  order,
  isBestOffer,
  isOwnOrder,
  removeOrder,
  ltv,
  size,
  interest,
}) => {
  const colorLTV = getColorByPercent(ltv, colorByPercentOffers);

  return (
    <li
      className={classNames(styles.listItem, {
        [styles.highlightBest]:
          order.rawData && interest === isBestOffer.interest,
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
        <div className={styles.value}>
          {size?.toFixed(3)}
          <div className={styles.loans}>3.5 loans</div>
        </div>
        <div className={styles.value}>{interest?.toFixed(3)}</div>
      </div>
      {isOwnOrder(order) && (
        <div
          className={classNames(styles.roundBtn, styles.btnTrash)}
          onClick={removeOrder(order)}
        >
          <Trash />
        </div>
      )}
    </li>
  );
};

export default Offer;
