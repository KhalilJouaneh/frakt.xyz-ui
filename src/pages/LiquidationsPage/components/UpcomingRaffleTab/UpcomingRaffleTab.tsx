import { FC, useEffect } from 'react';

import { useIntersection } from '@frakt/hooks/useIntersection';
import { useRaffleInfo } from '@frakt/hooks/useRaffleData';
import EmptyList from '@frakt/components/EmptyList';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './UpcomingRaffleTab.module.scss';
import RafflesList from '../RafflesList';
import GraceCard from '../GraceCard';

const UpcomingRaffleTab: FC = () => {
  const { queryData } = useRaffleSort();

  const { ref, inView } = useIntersection();

  const {
    data: graceList,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  } = useRaffleInfo({
    url: 'liquidation/grace-list',
    id: 'graceList',
    queryData,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <>
      <RafflesList isGraceList>
        {graceList?.length ? (
          <div className={styles.rafflesList} ref={ref}>
            {graceList?.map((raffle) => (
              <GraceCard key={raffle.nftMint} raffle={raffle} />
            ))}
          </div>
        ) : (
          <EmptyList text="No loans on grace at the moment" />
        )}
      </RafflesList>
    </>
  );
};

export default UpcomingRaffleTab;
