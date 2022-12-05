import { FC } from 'react';

import { useConfirmModal, ConfirmModal } from '@frakt/components/ConfirmModal';
import { RaffleListItem } from '@frakt/state/liquidations/types';
import { LoadingModal } from '@frakt/components/LoadingModal';
import styles from './LiquidationRaffleCard.module.scss';
import { useLiquidationsRaffle } from './hooks';
import Button from '@frakt/components/Button';
import { createTimerJSX } from '@frakt/utils';
import Icons from '../../../../iconsNew';
import { Timer } from '@frakt/icons';
import {
  GeneralCardInfo,
  StatsRaffleValues,
} from '../StatsRaffleValues/StatsRaffleValues';

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
      <GeneralCardInfo
        nftName={raffle.nftName}
        nftImageUrl={raffle.nftImageUrl}
      />
      <div className={styles.statsValue}>
        <StatsRaffleValues
          className={styles.opacity}
          label="Floor price"
          value={raffle.nftFloorPrice}
        />
        <StatsRaffleValues
          label="Liquidation price"
          value={raffle.liquidationPrice}
        />
        <StatsRaffleValues label="Duration">
          <div className={styles.wrapper}>
            <Timer />
            <div className={styles.countdown}>
              {createTimerJSX(raffle.expiredAt)}
            </div>
          </div>
        </StatsRaffleValues>
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
