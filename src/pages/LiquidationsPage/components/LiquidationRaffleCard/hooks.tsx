import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  participateInRaffle as participateInRaffleTxn,
  buyAuction as buyAuctionTxn,
} from '../../../../utils/raffles';
import { useConnection } from '../../../../hooks';
import { selectLotteryTickets } from '../../../../state/liquidations/selectors';
import { useLoadingModal } from '../../../../components/LoadingModal';

export const useLiquidationsRaffle = (data) => {
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

  console.log(loadingModalVisible);

  const isDisabledIncrement = ticketCount >= lotteryTickets.tickets.length;

  const handleSumit = () => {
    setTryId(null);
    participateInRaffle();
  };

  const handleClick = () => {
    setTryId(data.nftMint);
  };

  const participateInRaffle = async (): Promise<void> => {
    console.log(data);
    try {
      const { nftMint, ticketCount } = data;
      openLoadingModal();

      await participateInRaffleTxn({
        connection,
        wallet,
        tickets: ticketCount,
        raffleAddress: nftMint,
      });
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const buyAuction = async (): Promise<void> => {
    try {
      const { nftMint, receiver, auction } = data;
      openLoadingModal();

      await buyAuctionTxn({
        connection,
        wallet,
        nftMint,
        receiver,
        auction,
      });
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    participateInRaffle,
    buyAuction,
    incrementCounter,
    decrementCounter,
    isDisabledIncrement,
    ticketCount,
    handleSumit,
    handleClick,
    setTryId,
    tryId,
    loadingModalVisible,
    closeLoadingModal,
  };
};
