import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  participateInRaffle as participateInRaffleTxn,
  addTicketsToParticipation as addTicketsToParticipationTxn,
} from '@frakt/utils/raffles';
import { useConnection } from '../../../../hooks';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { RaffleListItem } from '@frakt/api/raffle';
import { useFetchUserTickets } from '../../hooks';

export const useLiquidationsRaffle = (raffle: RaffleListItem) => {
  const wallet = useWallet();
  const connection = useConnection();

  const { lotteryTickets } = useFetchUserTickets();
  const [ticketCount, setTicketCount] = useState<number>(0);
  const currentTickets = lotteryTickets?.currentTickets || 0;

  const incrementCounter = (): void => {
    setTicketCount(ticketCount + 1);
  };

  const decrementCounter = (): void => {
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
    }
  };

  const onMaxTickets = () => {
    setTicketCount(lotteryTickets.currentTickets);
  };

  const onResetTickets = () => {
    setTicketCount(0);
  };

  const handleChange = (event): void => {
    const valueNumber = parseFloat(event.target.value);
    if (valueNumber >= currentTickets) {
      setTicketCount(currentTickets);
    } else {
      setTicketCount(valueNumber || 0);
    }
  };

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const isDisabledIncrement = ticketCount >= currentTickets;
  const isParticipationExists =
    raffle?.isParticipationExists || !!raffle?.tickets;

  const onSubmit = async (): Promise<void> => {
    openLoadingModal();

    const params = {
      connection,
      wallet,
      tickets: ticketCount,
      raffleAddress: raffle?.rafflePubKey,
    };

    try {
      if (isParticipationExists) {
        await addTicketsToParticipationTxn(params);
      } else {
        await participateInRaffleTxn(params);
      }
      setTicketCount(0);
      closeConfirmModal();
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    incrementCounter,
    decrementCounter,
    isDisabledIncrement,
    ticketCount,
    onSubmit,
    loadingModalVisible,
    closeLoadingModal,
    setTicketCount,
    lotteryTickets,
    handleChange,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
    onMaxTickets,
    onResetTickets,
  };
};
