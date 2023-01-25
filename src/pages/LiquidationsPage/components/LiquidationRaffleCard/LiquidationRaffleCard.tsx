import { FC } from 'react';
import cx from 'classnames';

import { ConfirmModal } from '@frakt/components/ConfirmModal';
import { LoadingModal } from '@frakt/components/LoadingModal';
import styles from './LiquidationRaffleCard.module.scss';
import { createTimerJSX } from '@frakt/components/Timer';
import { useLiquidationsRaffle } from './hooks';
import Button from '@frakt/components/Button';
import { Timer, Minus, Plus } from '@frakt/icons';
import {
  GeneralCardInfo,
  StatsRaffleValues,
} from '../StatsRaffleValues/StatsRaffleValues';
import Tooltip from '@frakt/components/Tooltip';
import { RaffleListItem } from '@frakt/api/raffle';

interface LiquidationRaffleCard {
  raffle: RaffleListItem;
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
    handleChange,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  } = useLiquidationsRaffle(raffle);

  const isParticipationExists =
    raffle.isParticipationExists || !!raffle.tickets;

  return (
    <div className={styles.cardWrapper}>
      <div
        className={cx(
          styles.card,
          isParticipationExists && styles.participatedCard,
        )}
      >
        {isParticipationExists && (
          <div className={styles.badge}>
            You’ve used {raffle.tickets} tickets
          </div>
        )}
        <GeneralCardInfo
          nftName={raffle.nftName}
          nftImageUrl={raffle.nftImageUrl}
          nftCollectionName={raffle.nftCollectionName}
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
          <StatsRaffleValues label="Participating">
            <span>{raffle?.totalTickets || 0} TICKETS</span>
          </StatsRaffleValues>
        </div>
        <div className={styles.ticketsWrapper}>
          <p className={styles.subtitle}>Tickets</p>
          <div className={styles.ticketsInfo}>
            <Button
              type="tertiary"
              className={styles.counter}
              onClick={decrementCounter}
              disabled={ticketCount <= 0}
            >
              <Minus />
            </Button>
            <input
              value={ticketCount}
              className={cx(styles.input, ticketCount && styles.activeInput)}
              onChange={handleChange}
            />
            <Button
              type="tertiary"
              className={styles.counter}
              onClick={incrementCounter}
              disabled={isDisabledIncrement}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <Tooltip
          placement="top"
          trigger="hover"
          overlay="You need to use at least 1 ticket"
          overlayClassName={ticketCount && styles.hiddenOverlay}
        >
          <span>
            <Button
              type="secondary"
              className={styles.btn}
              onClick={openConfirmModal}
              disabled={disabled || !ticketCount}
            >
              {!ticketCount ? 'Try by 0 ticket' : 'Participate'}
            </Button>
          </span>
        </Tooltip>
      </div>

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
