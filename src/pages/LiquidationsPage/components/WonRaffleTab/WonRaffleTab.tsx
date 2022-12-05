import { FC } from 'react';

import { fetchRaffleHistory, useRafflesData } from '@frakt/api/raffle';
import NoWinningRaffles from '../NoWinningRaffles';
import styles from './WonRaffleTab.module.scss';
import WonRaffleCard from '../WonRaffleCard';
import RafflesList from '../RafflesList';
import { useRaffleSort } from '../Liquidations/hooks';

interface WonRaffleTabProps {
  onClick: () => void;
}

const WonRaffleTab: FC<WonRaffleTabProps> = ({ onClick }) => {
  const { queryData } = useRaffleSort();
  console.log(queryData);
  const { data: wonRaffleList, isLoading: isLoadingWonRaffleList } =
    useRafflesData({
      queryData,
      id: 'wonRaffleList',
      queryFunc: fetchRaffleHistory,
    });

  return (
    <>
      {!isLoadingWonRaffleList ? (
        <RafflesList isWonList>
          <div className={styles.rafflesList}>
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
