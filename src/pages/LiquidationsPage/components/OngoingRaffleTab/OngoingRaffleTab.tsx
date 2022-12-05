import { FC } from 'react';
import { useSelector } from 'react-redux';

import { fetchLiquidationRaffle, useRafflesData } from '@frakt/api/raffle';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { selectLotteryTickets } from '@frakt/state/liquidations/selectors';
import { selectWalletPublicKey } from '@frakt/state/common/selectors';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import EmptyList from '@frakt/componentsNew/EmptyList';
import { useRaffleSort } from '../Liquidations/hooks';
import styles from './OngoingRaffleTab.module.scss';
import RafflesList from '../RafflesList';

const OngoingRaffleTab: FC = () => {
  const lotteryTickets = useSelector(selectLotteryTickets);
  const publicKey = useSelector(selectWalletPublicKey);

  const { queryData } = useRaffleSort();
  const { data: raffleList, isLoading: isLoadingRaffleList } = useRafflesData({
    queryData,
    id: 'ongoingRaffleList',
    queryFunc: fetchLiquidationRaffle,
  });

  return (
    <>
      {publicKey ? (
        <RafflesList withRafflesInfo>
          {!isLoadingRaffleList && raffleList?.length ? (
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
