import { FC } from 'react';
import classNames from 'classnames';

import { useConfirmModal, ConfirmModal } from '@frakt/components/ConfirmModal';
import { RaffleListItem } from '@frakt/state/liquidations/types';
import { LoadingModal } from '@frakt/components/LoadingModal';
import styles from './LiquidationRaffleCard.module.scss';
import { SolanaIcon, Timer } from '@frakt/icons';
import { useLiquidationsRaffle } from './hooks';
import Button from '@frakt/components/Button';
import Icons from '../../../../iconsNew';

interface LiquidationRaffleCard {
  raffle?: RaffleListItem;
  disabled: boolean;
}

const LiquidationRaffleCard: FC<LiquidationRaffleCard> = ({
  raffle,
  disabled,
}) => {
  const {
    incrementCounter,
    decrementCounter,
    isDisabledIncrement,
    ticketCount,
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
  } = useLiquidationsRaffle(raffle);

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={raffle.nftImageUrl} />
        <div>
          <p className={styles.nftName}>{raffle.nftName}</p>
        </div>
      </div>
      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>Floor price</p>
          <p className={styles.value}>
            {`${raffle.nftFloorPrice}`} <SolanaIcon />
          </p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>
            {`${raffle.liquidationPrice}`}
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
        onClick={openConfirmModal}
        disabled={disabled || !ticketCount}
      >
        {disabled ? 'Try by 0 ticket' : 'Participate'}
      </Button>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={onSubmit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to try your chance in raffle for ${raffle.nftName}`}
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
