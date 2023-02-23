import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';

import Button from '@frakt/components/Button';
import Toggle from '@frakt/components/Toggle';
import { Loader } from '@frakt/components/Loader';
import { PATHS } from '@frakt/constants';
import { ArrowDownTableSort, ArrowUpTableSort, Chevron } from '@frakt/icons';
import PartyHorn from '@frakt/icons/PartyHorn';
import { Market } from '@frakt/api/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { makeRemoveOrderTransaction } from '@frakt/utils/bonds';
import { useConnection } from '@frakt/hooks';

import Offer from '../Offer/Offer';
import { useMarketOrders } from './hooks';
import { MarketOrder } from './types';
import styles from './OrderBook.module.scss';

interface OrderBookProps {
  market: Market;
  hideEditButtons?: boolean;
  syntheticParams?: {
    ltv: number;
    interest: number;
    offerSize: number;
    durationDays: number;
  };
}

const OrderBook: FC<OrderBookProps> = ({
  market,
  syntheticParams,
  // hideEditButtons,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  // const editOrder = (order: MarketOrder) => {
  //   history.push(
  //     `${PATHS.OFFER}/${market?.marketPubkey}/${order?.rawData?.publicKey}`,
  //   );
  // };

  const removeOrder = async (order: MarketOrder) => {
    try {
      const { transaction, signers } = await makeRemoveOrderTransaction({
        pairPubkey: new web3.PublicKey(order.rawData.publicKey),
        authorityAdapter: new web3.PublicKey(order.rawData.authorityAdapter),
        edgeSettlement: order.rawData.edgeSettlement,
        wallet,
        connection,
      });

      await signAndConfirmTransaction({
        connection,
        transaction,
        signers,
        wallet,

        onAfterSend: () => hidePair?.(order.rawData.publicKey),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
      console.error(error);
    }
  };

  const isOwnOrder = (order: MarketOrder) =>
    order?.rawData?.assetReceiver === wallet?.publicKey?.toBase58();

  const [showOwnOrders, setShowOwnOrders] = useState(false);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const toggleSort = () => {
    sort === 'desc' ? setSort('asc') : setSort('desc');
  };

  const { offers, isLoading, offersExist, hidePair } = useMarketOrders({
    marketPubkey: new web3.PublicKey(market?.marketPubkey),
    sortDirection: sort,
    walletOwned: showOwnOrders,
    ltv: syntheticParams?.ltv,
    size: syntheticParams?.offerSize,
    interest: syntheticParams?.interest,
    duration: syntheticParams?.durationDays,
  });

  const bestOffer = useMemo(() => {
    return offers.at(0)?.synthetic ? offers.at(1) : offers.at(0);
  }, [offers]);

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
        [styles.create]: syntheticParams?.ltv,
      })}
    >
      <div
        className={classNames(styles.roundBtn, styles.btnChevron, {
          [styles.active]: openOffersMobile,
        })}
        onClick={toggleOffers}
      >
        <Chevron />
      </div>

      <div
        className={classNames(styles.header, {
          [styles.active]: openOffersMobile,
          [styles.create]: syntheticParams?.ltv,
        })}
      >
        <h5 className={styles.title}>Offers</h5>
        <Toggle
          label="My offers only"
          className={classNames(styles.toggle, {
            [styles.active]: openOffersMobile,
          })}
          defaultChecked={showOwnOrders}
          onChange={(nextValue) => setShowOwnOrders(nextValue)}
        />

        {offersExist && (
          <div
            className={classNames(styles.columnWrapper, {
              [styles.active]: openOffersMobile,
              [styles.create]: syntheticParams?.ltv,
            })}
          >
            <div className={styles.col}>
              <span className={styles.colName}>size</span>
              <span>(SOL)</span>
            </div>
            <div onClick={toggleSort} className={styles.col}>
              <span className={styles.colName}>Interest</span>
              <span>(%)</span>
              {sort === 'desc' ? <ArrowDownTableSort /> : <ArrowUpTableSort />}
            </div>
          </div>
        )}
      </div>

      <div
        className={classNames(styles.content, {
          [styles.active]: openOffersMobile,
          [styles.create]: syntheticParams?.ltv,
          [styles.visible]: !offersExist,
        })}
      >
        {isLoading && (
          <Loader
            size="default"
            className={classNames(styles.loader, {
              [styles.active]: openOffersMobile,
              [styles.create]: syntheticParams?.ltv,
            })}
          />
        )}

        {!isLoading && offersExist && (
          <ul
            className={classNames(styles.list, {
              [styles.create]: syntheticParams?.ltv,
              [styles.active]: openOffersMobile,
            })}
          >
            {offers.map((offer, idx) => (
              <Offer
                ltv={offer.ltv}
                size={offer.size}
                interest={offer.interest}
                order={offer}
                bestOffer={bestOffer}
                duration={offer.duration}
                // editOrder={!hideEditButtons && (() => editOrder(offer))}
                removeOrder={() => removeOrder(offer)}
                isOwnOrder={isOwnOrder(offer)}
                key={idx}
              />
            ))}
          </ul>
        )}
        {!isLoading && !offersExist && !syntheticParams?.ltv && (
          <div
            className={classNames(styles.noData, {
              [styles.active]: openOffersMobile,
              [styles.create]: syntheticParams?.ltv,
            })}
          >
            <PartyHorn />
            <div className={styles.noDataTitle}>
              No active offers at the moment
            </div>
            <div className={styles.noDataSubTitle}>
              Good chance to be first!
            </div>
          </div>
        )}

        {!syntheticParams?.ltv && (
          <NavLink to={`${PATHS.OFFER}/${market?.marketPubkey}`}>
            <Button className={styles.btn} type="secondary">
              Place offer
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
