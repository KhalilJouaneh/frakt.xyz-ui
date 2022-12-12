import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { selectLotteryTickets } from '@frakt/state/liquidations/selectors';
import { useIntersection } from '@frakt/hooks/useIntersection';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { useRaffleInfo } from '@frakt/hooks/useRaffleData';
import EmptyList from '@frakt/componentsNew/EmptyList';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './OngoingRaffleTab.module.scss';
import { RaffleListItem } from '@frakt/api/raffle';
import { useLiquidationRaffles } from './hooks';
import RafflesList from '../RafflesList';

const OngoingRaffleTab: FC = () => {
  const lotteryTickets = useSelector(selectLotteryTickets);
  const { publicKey } = useWallet();

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

  const { setRaffles } = useLiquidationRaffles();

  useEffect(() => {
    setRaffles(raffleList);
  }, [inView]);

  return (
    <>
      {publicKey ? (
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
      ) : (
        <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
      )}
    </>
  );
};

export default OngoingRaffleTab;
