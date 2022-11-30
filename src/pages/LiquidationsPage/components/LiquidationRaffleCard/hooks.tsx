import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  participateInRaffle as participateInRaffleTxn,
  addTicketsToParticipation as addTicketsToParticipationTxn,
} from '../../../../utils/raffles';
import { useConnection } from '../../../../hooks';
import { selectLotteryTickets } from '../../../../state/liquidations/selectors';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { RaffleListItem } from '@frakt/state/liquidations/types';

export const useLiquidationsRaffle = (data: RaffleListItem) => {
  const wallet = useWallet();
  const connection = useConnection();

  const [tryId, setTryId] = useState<string>(null);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const lotteryTickets = useSelector(selectLotteryTickets);

  const incrementCounter = (): void => {
    setTicketCount(ticketCount + 1);
  };

  const decrementCounter = (): void => {
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
    }
  };

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const isDisabledIncrement = ticketCount >= lotteryTickets?.totalTickets;

  const onSubmit = async (): Promise<void> => {
    openLoadingModal();

    const params = {
      connection,
      wallet,
      tickets: ticketCount,
      raffleAddress: data?.rafflePubKey,
    };

    console.log(data);

    try {
      if (data.tickets) {
        await addTicketsToParticipationTxn(params);
      } else {
        await participateInRaffleTxn(params);
      }
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
    setTryId,
    tryId,
    loadingModalVisible,
    closeLoadingModal,
  };
};
