import { FC } from 'react';
import { fetchGraceRaffle, useRafflesData } from '@frakt/api/raffle';
import EmptyList from '@frakt/componentsNew/EmptyList';
import styles from './UpcomingRaffleTab.module.scss';
import RafflesList from '../RafflesList';
import GraceCard from '../GraceCard';
import { useRaffleSort } from '../Liquidations/hooks';

const UpcomingRaffleTab: FC = () => {
  const { queryData } = useRaffleSort();

  const { data: graceList, isLoading: isLoadingWonRaffleList } = useRafflesData(
    {
      queryData,
      id: 'graceRaffle',
      queryFunc: fetchGraceRaffle,
    },
  );

  return (
    <>
      <RafflesList isGraceList>
        {!isLoadingWonRaffleList && graceList?.length ? (
          <div className={styles.rafflesList}>
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
