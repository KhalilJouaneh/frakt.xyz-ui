import { FC, useEffect, useState } from 'react';
import Button from '@frakt/components/Button';
import RoundButton from '@frakt/components/RoundButton/RoundButton';
import Toggle from '@frakt/components/Toggle';
import { useLendingPoolsFiltering } from '@frakt/pages/LendPage/hooks/useLendingPoolsFiltering';
import { Controller } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Trash } from '@frakt/iconsNew/Trash';
import { Chevron } from '@frakt/iconsNew/Chevron';
import styles from './OrderBook.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}
interface OrderBookProps {
  onClick?: () => void;
}

interface arrOrdersProps {
  size: string;
  price: string;
}

const arrOrdersMock: arrOrdersProps[] = [
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

const OrderBook: FC<OrderBookProps> = ({ onClick }) => {
  const [arrOrders, setArrOrders] = useState(arrOrdersMock);
  const [showOrderBook, setShowOrderBook] = useState<boolean>(false);
  const { control, sort, setSearch, pools, setValue, showStakedOnlyToggle } =
    useLendingPoolsFiltering();

  const width = document.body.clientWidth;

  useEffect(() => {
    if (width > 767) {
      setShowOrderBook(true);
    } else {
      setShowOrderBook(false);
    }
  }, [width]);

  const removeOrder = (idx) => () => {
    setArrOrders((prev) => [...prev].filter((el, id) => id !== idx));
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
                SIZE (fndSMB) <div className={styles.arrowTriangle} />
              </div>
              <div className={styles.colName}>
                PRICE (SOL)
                <div className={styles.arrowTriangle} />
              </div>
            </div>
            <ul className={styles.list}>
              {arrOrders.map(({ size, price }, idx) => (
                <li className={styles.listItem} key={idx}>
                  <div className={styles.value}>{size}</div>
                  <div className={styles.btnTrashWrapper}>
                    <div className={styles.value}>{price}</div>
                    <RoundButton
                      icon={<Trash />}
                      size={32}
                      onClick={removeOrder(idx)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div
        className={classNames(styles.btnWrapper, {
          [styles.active]: !showOrderBook,
        })}
        onClick={onClick}
      >
        <Button className={styles.btn} type="secondary">
          Place orders
        </Button>
      </div>
    </div>
  );
};

export default OrderBook;
