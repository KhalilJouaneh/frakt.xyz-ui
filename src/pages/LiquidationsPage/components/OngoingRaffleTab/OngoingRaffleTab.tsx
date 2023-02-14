import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useRaffleInfo } from '@frakt/hooks/useRaffleData';
import EmptyList from '@frakt/components/EmptyList';
import { RaffleListItem } from '@frakt/api/raffle';

import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './OngoingRaffleTab.module.scss';
import { useFetchUserTickets } from '../../hooks';
import RafflesList from '../RafflesList';

const OngoingRaffleTab: FC = () => {
  const { publicKey, connected } = useWallet();

  const { lotteryTickets } = useFetchUserTickets();
  const { ref, inView } = useIntersection();
  const { queryData } = useRaffleSort();

  const userQueryData = { ...queryData, user: publicKey?.toBase58() };

  const {
    data: raffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useRaffleInfo({
    url: 'liquidation',
    id: 'ongoingRaffleList',
    queryData: userQueryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  if (!connected) {
    return (
      <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
    );
  }

  return (
    <RafflesList withRafflesInfo>
      {raffleList?.length ? (
        <div className={styles.rafflesList} ref={ref}>
          {raffleList.map((raffle: RaffleListItem) => (
            <LiquidationRaffleCard
              key={raffle.rafflePubKey}
              raffle={raffle}
              disabled={lotteryTickets?.currentTickets < 1}
            />
          ))}
        </div>
      ) : (
        <EmptyList text="No ongoing raffles at the moment" />
      )}
    </RafflesList>
  );
};

export default OngoingRaffleTab;
