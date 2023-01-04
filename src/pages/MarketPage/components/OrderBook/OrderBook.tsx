import { NavLink } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import Button from '@frakt/components/Button';
import RoundButton from '@frakt/components/RoundButton/RoundButton';
import Toggle from '@frakt/components/Toggle';
import { useConnection, useWindowSize } from '@frakt/hooks';
import classNames from 'classnames/bind';
import { Trash, Chevron } from '@frakt/icons';
import styles from './OrderBook.module.scss';
import { PATHS } from '@frakt/constants';
import { useMarketOrders } from './hooks';
import { web3 } from 'fbonds-core';
import { MarketOrder } from './types';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader } from '@frakt/components/Loader';
import { makeRemoveOrderTransaction } from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';

interface OrderBookProps {
  marketPubkey: string;
  hideCreateBtn?: boolean;
}

const OrderBook: FC<OrderBookProps> = ({
  marketPubkey,
  hideCreateBtn = false,
}) => {
  const wallet = useWallet();
  const connection = useConnection();
  const [showOrderBook, setShowOrderBook] = useState<boolean>(false);

  const size = useWindowSize();

  useEffect(() => {
    if (size.width > 768) {
      setShowOrderBook(true);
    } else {
      setShowOrderBook(false);
    }
  }, [size.width]);

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
    order.rawData.assetReceiver === wallet?.publicKey?.toBase58();

  const [showOwnOrders, setShowOwnOrders] = useState(false);
  //TODO: Implement sorting
  const [sort /* setSort */] = useState<'asc' | 'desc'>('desc');

  const { orders, isLoading } = useMarketOrders({
    marketPubkey: new web3.PublicKey(marketPubkey),
    sortDirection: sort,
    walletOwned: showOwnOrders,
  });

  if (isLoading) return <Loader size="large" />;

  return (
    <div
      className={classNames(styles.orderBook, {
        [styles.active]: showOrderBook,
      })}
    >
      <div
        className={classNames(styles.btnChevronWrapper, {
          [styles.active]: showOrderBook,
        })}
        onClick={() => setShowOrderBook(!showOrderBook)}
      >
        <RoundButton icon={<Chevron />} size={32} />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>Order Book</div>
          {showOrderBook && (
            <Toggle
              label="My pools only"
              className={styles.toggle}
              defaultChecked={showOwnOrders}
              onChange={(nextValue) => setShowOwnOrders(nextValue)}
            />
          )}
        </div>
        {showOrderBook && (
          <>
            <div className={styles.col}>
              <div className={styles.colName}>
                <div>SIZE (fndSMB)</div>
                <div className={styles.arrowTriangle} />
              </div>
              <div className={styles.colName}>
                <div>PRICE (SOL)</div>
                <div className={styles.arrowTriangle} />
              </div>
            </div>
            <ul className={styles.list}>
              {orders.map((order) => (
                <li className={styles.listItem} key={order.rawData.publicKey}>
                  <div className={styles.value}>{order.size.toFixed(3)}</div>
                  <div className={styles.btnTrashWrapper}>
                    <div className={styles.value}>
                      {order.interest.toFixed(3)}
                    </div>
                    {isOwnOrder(order) && (
                      <RoundButton
                        icon={<Trash />}
                        size={32}
                        onClick={removeOrder(order)}
                        className={styles.roundBtn}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {!hideCreateBtn && (
        <NavLink
          to={`${PATHS.BOND}/${marketPubkey}/create`}
          className={classNames(styles.btnWrapper, {
            [styles.active]: !showOrderBook,
          })}
        >
          <Button className={styles.btn} type="secondary">
            Place orders
          </Button>
        </NavLink>
      )}
    </div>
  );
};

export default OrderBook;
