import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import Button from '../../../../components/Button';
import { SolanaIcon, Timer } from '../../../../icons';
import { liquidationsActions } from '../../../../state/liquidations/actions';
import { selectTxRaffleTryStatus } from '../../../../state/liquidations/selectors';
import { useOnFulfilled } from '../../../../hooks';
import styles from './LiquidationRaffleCard.module.scss';
import Icons from '../../../../iconsNew';

const LiquidationRaffleCard: FC<{ data; disabled: boolean }> = ({
  data,
  disabled,
}) => {
  const [tryId, setTryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const txRequestStatus = useSelector(selectTxRaffleTryStatus);
  useOnFulfilled(txRequestStatus, () => {
    setIsLoading(false);
  });

  const [ticketCount, setTicketCount] = useState<number>(0);

  const handleClick = () => {
    setTryId(data.nftMint);
  };

  const handleSumit = () => {
    setTryId(null);
    setIsLoading(true);
    dispatch(liquidationsActions.txRaffleTry(data));
  };

  const incrementCounter = (): void => {
    setTicketCount(ticketCount + 1);
  };

  const decrementCounter = (): void => {
    setTicketCount(ticketCount - 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={data.nftImageUrl} />
        <div>
          <p className={styles.nftName}>{data.nftName}</p>
        </div>
      </div>
      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>Floor price</p>
          <p className={styles.value}>
            {`${data.nftFloorPrice}`} <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>
            {`${data.liquidationPrice}`}
            <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>Duration</p>
          <div className={styles.wrapper}>
            <Timer />
            <div className={styles.countdown}>9m : 46s</div>
          </div>
        </div>
      </div>
      <div className={styles.ticketsWrapper}>
        <p className={styles.subtitle}>Tickets</p>
        <div className={styles.ticketsInfo}>
          <div className={styles.counter} onClick={decrementCounter}>
            <Icons.Minus />
          </div>
          <div className={styles.counterValue}>{ticketCount}</div>
          <div className={styles.counter} onClick={incrementCounter}>
            <Icons.Plus />
          </div>
        </div>
      </div>
      <Button
        type="secondary"
        className={styles.btn}
        onClick={handleClick}
        disabled={disabled}
      >
        {disabled ? 'Try by 0 ticket' : 'Participate'}
      </Button>
      <ConfirmModal
        visible={tryId}
        onCancel={() => setTryId(null)}
        onSubmit={handleSumit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to try your chance in raffle for ${data.nftName}`}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={isLoading}
        onCancel={() => setIsLoading(false)}
      />
    </div>
  );
};

export default LiquidationRaffleCard;
