import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { liquidationsActions } from '@frakt/state/liquidations/actions';
import { useRaffleHistory } from '@frakt/api/raffle';
import NoWinningRaffles from '../NoWinningRaffles';
import styles from './WonRaffleTab.module.scss';
import WonRaffleCard from '../WonRaffleCard';
import RafflesList from '../RafflesList';

interface WonRaffleTabProps {
  onClick: () => void;
}

const WonRaffleTab: FC<WonRaffleTabProps> = ({ onClick }) => {
  const { data: wonRaffleList, isLoading: isLoadingWonRaffleList } =
    useRaffleHistory();

  const dispatch = useDispatch();

  return (
    <>
      {!isLoadingWonRaffleList ? (
        <RafflesList
          isWonList
          fetchItemsFunc={(params) =>
            dispatch(liquidationsActions.fetchWonRaffleList(params))
          }
        >
          <div className={styles.rafflesList}>
            {wonRaffleList.map((raffle) => (
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
