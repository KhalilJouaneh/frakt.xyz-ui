import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGraceList } from '@frakt/state/liquidations/selectors';
import { liquidationsActions } from '@frakt/state/liquidations/actions';
import EmptyList from '@frakt/componentsNew/EmptyList';
import GraceCard from '../GraceCard';
import RafflesList from '../RafflesList';
import styles from './UpcomingRaffleTab.module.scss';

const UpcomingRaffleTab: FC = () => {
  const dispatch = useDispatch();
  const graceList = useSelector(selectGraceList);

  return (
    <>
      <RafflesList
        isGraceList
        fetchItemsFunc={(params) =>
          dispatch(liquidationsActions.fetchGraceList(params))
        }
      >
        {graceList.length ? (
          <div className={styles.rafflesList}>
            {graceList.map((raffle) => (
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
