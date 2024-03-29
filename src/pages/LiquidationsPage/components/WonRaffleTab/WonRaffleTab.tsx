import { FC, useEffect } from 'react';

import { useRaffleInfo } from '@frakt/hooks/useRaffleData';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './WonRaffleTab.module.scss';
import WonRaffleCard from '../WonRaffleCard';
import RafflesList from '../RafflesList';
import EmptyList from '@frakt/components/EmptyList';
import { WonRaffleListItem } from '@frakt/api/raffle';

const WonRaffleTab: FC = () => {
  const { queryData } = useRaffleSort();
  const { ref, inView } = useIntersection();

  const {
    data: wonRaffleList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useRaffleInfo({
    url: 'liquidation?history=true&',
    id: 'wonRaffleList',
    queryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <>
      <RafflesList isWonList>
        {wonRaffleList?.length ? (
          <div className={styles.rafflesList} ref={ref}>
            {wonRaffleList?.map((raffle: WonRaffleListItem) => (
              <WonRaffleCard key={raffle.rafflePubKey} raffle={raffle} />
            ))}
          </div>
        ) : (
          <EmptyList text="No raffles at the moment" />
        )}
      </RafflesList>
    </>
  );
};

export default WonRaffleTab;
