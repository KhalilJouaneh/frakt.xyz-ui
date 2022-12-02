import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { liquidationsActions } from '@frakt/state/liquidations/actions';
import { selectWalletPublicKey } from '@frakt/state/common/selectors';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import EmptyList from '@frakt/componentsNew/EmptyList';
import styles from './OngoingRaffleTab.module.scss';
import {
  selectLotteryTickets,
  selectRaffleList,
} from '@frakt/state/liquidations/selectors';
import RafflesList from '../RafflesList';

const OngoingRaffleTab: FC = () => {
  const dispatch = useDispatch();

  const lotteryTickets = useSelector(selectLotteryTickets);
  const publicKey = useSelector(selectWalletPublicKey);
  const raffleList = useSelector(selectRaffleList);

  return (
    <>
      {publicKey ? (
        <RafflesList
          withRafflesInfo
          fetchItemsFunc={(params) =>
            dispatch(liquidationsActions.fetchRaffleList(params))
          }
        >
          {raffleList.length ? (
            <div className={styles.rafflesList}>
              {raffleList.map((raffle) => (
                <LiquidationRaffleCard
                  key={raffle.nftMint}
                  raffle={raffle}
                  disabled={lotteryTickets?.totalTickets < 1}
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
