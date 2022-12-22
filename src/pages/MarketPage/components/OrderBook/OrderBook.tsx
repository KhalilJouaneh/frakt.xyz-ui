import { NavLink } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import Button from '@frakt/components/Button';
import RoundButton from '@frakt/components/RoundButton/RoundButton';
import Toggle from '@frakt/components/Toggle';
import { useWindowSize } from '@frakt/hooks';
import { useLendingPoolsFiltering } from '@frakt/pages/LendPage/hooks/useLendingPoolsFiltering';
import { Controller } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Trash } from '@frakt/iconsNew/Trash';
import { Chevron } from '@frakt/iconsNew/Chevron';
import styles from './OrderBook.module.scss';
import { PATHS } from '@frakt/constants';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}
interface OrderBookProps {
  marketPubkey: string;
  hideCreateBtn?: boolean;
}

interface Order {
  size: string;
  price: string;
}

const ordersMock: Order[] = [
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
  { size: '206,324.01', price: '2212.021' },
];

const OrderBook: FC<OrderBookProps> = ({
  marketPubkey,
  hideCreateBtn = false,
}) => {
  const [arrOrders, setArrOrders] = useState(ordersMock);
  const [showOrderBook, setShowOrderBook] = useState<boolean>(false);
  const {
    control /* sort, setSearch, pools, setValue, showStakedOnlyToggle */,
  } = useLendingPoolsFiltering();

  const isMyLoans = false;
  const size = useWindowSize();

  useEffect(() => {
    if (size.width > 768) {
      setShowOrderBook(true);
    } else {
      setShowOrderBook(false);
    }
  }, [size.width]);

  const removeOrder = (idx: number) => () => {
    setArrOrders((prev) => [...prev].filter((_, id) => id !== idx));
  };

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
            <Controller
              control={control}
              name={InputControlsNames.SHOW_STAKED}
              render={({ field: { ref, ...field } }) => (
                <Toggle
                  label="My pools only"
                  className={styles.toggle}
                  name={InputControlsNames.SHOW_STAKED}
                  {...field}
                />
              )}
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
              {arrOrders.map(({ size, price }, idx) => (
                <li
                  className={styles.listItem}
                  key={idx}
                  style={{
                    background: `linear-gradient(
                  to left,
                  var(--light-green-color-1) ${50}%,
                  var(--primary-background) ${50}%
                )`,
                  }}
                >
                  <div className={styles.value}>{size}</div>
                  <div className={styles.btnTrashWrapper}>
                    <div className={styles.value}>{price}</div>
                    {isMyLoans && (
                      <RoundButton
                        icon={<Trash />}
                        size={32}
                        onClick={removeOrder(idx)}
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
