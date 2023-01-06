import { FC, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useConnection } from '@frakt/hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'fbonds-core';
import Button from '@frakt/components/Button';
import Offer from '../Offer/Offer';
import Toggle from '@frakt/components/Toggle';
import { Loader } from '@frakt/components/Loader';
import { makeRemoveOrderTransaction } from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useMarketOrders } from './hooks';
import { PATHS } from '@frakt/constants';
import { MarketOrder } from './types';
import { Chevron } from '@frakt/icons';
import PartyHorn from '@frakt/icons/PartyHorn';
import styles from './OrderBook.module.scss';

interface OrderBookProps {
  marketPubkey: string;
  createOffer?: boolean;
  maxLTV?: number;
  solFee?: string;
  solDeposit?: string;
}

const OrderBook: FC<OrderBookProps> = ({
  marketPubkey,
  createOffer = false,
  maxLTV,
  solFee,
  solDeposit,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const [openOffersMobile, setOpenOffersMobile] = useState<boolean>(false);
  const toggleOffers = () => setOpenOffersMobile((prev) => !prev);

  const removeOrder = (order: MarketOrder) => async () => {
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

  const { offers, isLoading, isOffersExist } = useMarketOrders({
    marketPubkey: new web3.PublicKey(marketPubkey),
    sortDirection: sort,
    walletOwned: showOwnOrders,
    createOffer,
    ltv: maxLTV,
    size: Number(solDeposit),
    interest: Number(solFee),
  });

  const bestOffer = useMemo(() => {
    if (sort === 'desc') {
      return offers.at(0)?.synthetic ? offers.at(1) : offers.at(0);
    }
    return offers.at(-1)?.synthetic ? offers.at(-2) : offers.at(-1);
  }, [offers, sort]);

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: openOffersMobile,
        [styles.create]: createOffer,
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
          [styles.create]: createOffer,
        })}
      >
        <h5 className={styles.title}>Offers</h5>
        {isOffersExist && (
          <Toggle
            label="My pools only"
            className={classNames(styles.toggle, {
              [styles.active]: openOffersMobile,
            })}
            defaultChecked={showOwnOrders}
            onChange={(nextValue) => setShowOwnOrders(nextValue)}
          />
        )}

        {isOffersExist && (
          <div
            className={classNames(styles.columnWrapper, {
              [styles.active]: openOffersMobile,
              [styles.create]: createOffer,
            })}
          >
            <div className={styles.col}>
              <span className={styles.colName}>size</span>
              <span>(fndSMB)</span>
            </div>
            <div
              className={classNames(styles.col, {
                [styles.sort]: sort === 'asc',
              })}
              onClick={toggleSort}
            >
              <span className={styles.colName}>interest</span>
              <span>(SOL)</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={classNames(styles.content, {
          [styles.active]: openOffersMobile,
          [styles.create]: createOffer,
          [styles.visible]: !isOffersExist,
        })}
      >
        {isLoading && (
          <Loader
            size="default"
            className={classNames(styles.loader, {
              [styles.active]: openOffersMobile,
              [styles.create]: createOffer,
            })}
          />
        )}

        {!isLoading && isOffersExist && (
          <ul
            className={classNames(styles.list, {
              [styles.create]: createOffer,
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
                removeOrder={removeOrder}
                isOwnOrder={isOwnOrder}
                key={idx}
              />
            ))}
          </ul>
        )}
        {!isLoading && !isOffersExist && !createOffer && (
          <div
            className={classNames(styles.noData, {
              [styles.active]: openOffersMobile,
              [styles.create]: createOffer,
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

        {!createOffer && (
          <NavLink to={`${PATHS.BOND}/${marketPubkey}/create`}>
            <Button className={styles.btn} type="secondary">
              Place offers
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default OrderBook;
