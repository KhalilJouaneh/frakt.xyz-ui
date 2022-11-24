import { FC } from 'react';
import classNames from 'classnames';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import styles from './LiquidationRaffleCard.module.scss';
import { SolanaIcon, Timer } from '../../../../icons';
import Button from '../../../../components/Button';
import { useLiquidationsRaffle } from './hooks';
import Icons from '../../../../iconsNew';

const LiquidationRaffleCard: FC<{ data; disabled: boolean }> = ({
  data,
  disabled,
}) => {
  const {
    incrementCounter,
    decrementCounter,
    isDisabledIncrement,
    ticketCount,
    handleSumit,
    handleClick,
    closeLoadingModal,
    loadingModalVisible,
    setTryId,
    tryId,
  } = useLiquidationsRaffle(data);

  console.log(data);

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
          <Button
            type="tertiary"
            className={styles.counter}
            onClick={decrementCounter}
          >
            <Icons.Minus />
          </Button>
          <div className={styles.counterValue}>{ticketCount}</div>
          <Button
            type="tertiary"
            className={styles.counter}
            onClick={incrementCounter}
            disabled={isDisabledIncrement}
          >
            <Icons.Plus />
          </Button>
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
        visible={!!tryId}
        onCancel={() => setTryId(null)}
        onSubmit={handleSumit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to try your chance in raffle for ${data.nftName}`}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </div>
  );
};

export default LiquidationRaffleCard;
