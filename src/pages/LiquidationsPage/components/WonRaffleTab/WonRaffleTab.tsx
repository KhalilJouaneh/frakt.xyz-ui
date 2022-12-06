import { FC, useEffect } from 'react';

import { useRaffleInfo } from '@frakt/hooks/useRaffleInfo';
import { useIntersection } from '@frakt/hooks/useIntersection';
import { useRaffleSort } from '../Liquidations/hooks';
import NoWinningRaffles from '../NoWinningRaffles';
import styles from './WonRaffleTab.module.scss';
import WonRaffleCard from '../WonRaffleCard';
import RafflesList from '../RafflesList';

interface WonRaffleTabProps {
  onClick: () => void;
}

const url = `https://${process.env.BACKEND_DOMAIN}/liquidation?history=true`;

const WonRaffleTab: FC<WonRaffleTabProps> = ({ onClick }) => {
  const { queryData } = useRaffleSort();
  const { ref, inView } = useIntersection();

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useRaffleInfo({ url, id: 'wonRaffleList', queryData });

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const wonRaffleList = data?.pages?.map((page) => page.data).flat();

  return (
    <>
      {wonRaffleList?.length ? (
        <RafflesList isWonList>
          <div className={styles.rafflesList} ref={ref}>
            {wonRaffleList?.map((raffle) => (
              <WonRaffleCard key={raffle.nftMint} raffle={raffle} />
            ))}
          </div>
        </RafflesList>
      ) : (
        <NoWinningRaffles onClick={onClick} />
      )}
    </>
  );
};

export default WonRaffleTab;
