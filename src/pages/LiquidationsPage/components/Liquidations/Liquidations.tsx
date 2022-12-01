import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { liquidationsActions } from '../../../../state/liquidations/actions';
import { RAFFLES_TABS } from '.';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { LiquidationsTabsNames } from '../../model';
import { Tabs, useTabs } from '../../../../components/Tabs';
import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import NoWinningRaffles from '../NoWinningRaffles';
import LiquidationsList from '../LiquidationsList';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';
import WonRaffleCard from '../WonRaffleCard';
import EmptyList from '../../../../componentsNew/EmptyList';
import {
  selectSocket,
  selectWalletPublicKey,
} from '../../../../state/common/selectors';
import {
  selectGraceList,
  selectRaffleList,
  selectWonRaffleList,
  selectLotteryTickets,
} from '../../../../state/liquidations/selectors';

const Liquidations: FC = () => {
  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: RAFFLES_TABS,
    defaultValue: RAFFLES_TABS[0].value,
  });

  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);
  const graceList = useSelector(selectGraceList);
  const raffleList = useSelector(selectRaffleList);
  const wonRaffleList = useSelector(selectWonRaffleList);
  const lotteryTickets = useSelector(selectLotteryTickets);

  useEffect(() => {
    dispatch(liquidationsActions.fetchWonRaffleList());
    dispatch(liquidationsActions.fetchCollectionsList());
    dispatch(liquidationsActions.fetchRaffleList());
    dispatch(liquidationsActions.fetchGraceList());
  }, [dispatch, socket]);

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('lottery-tickets-subscribe', publicKey);
    }
  }, [socket, publicKey]);

  const handleTryLottery = () => {
    setTabValue(RAFFLES_TABS[0].value);
  };

  return (
    <div className={styles.container}>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <div className={styles.tabContent}>
        {tabValue === LiquidationsTabsNames.ONGOING &&
          (publicKey ? (
            <LiquidationsList
              withRafflesInfo
              fetchItemsFunc={(params) =>
                dispatch(liquidationsActions.fetchRaffleList(params))
              }
            >
              {raffleList.length ? (
                raffleList.map((raffle) => (
                  <LiquidationRaffleCard
                    key={raffle.nftMint}
                    raffle={raffle}
                    disabled={lotteryTickets?.totalTickets < 1}
                  />
                ))
              ) : (
                <EmptyList text="No ongoing raffles at the moment" />
              )}
            </LiquidationsList>
          ) : (
            <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
          ))}
        {tabValue === LiquidationsTabsNames.UPCOMING && (
          <LiquidationsList
            isGraceList
            fetchItemsFunc={(params) =>
              dispatch(liquidationsActions.fetchGraceList(params))
            }
          >
            {graceList.length ? (
              graceList.map((item) => (
                <GraceCard key={item.nftMint} data={item} />
              ))
            ) : (
              <EmptyList text="No loans on grace at the moment" />
            )}
          </LiquidationsList>
        )}
        {tabValue === LiquidationsTabsNames.HISTORY &&
          (wonRaffleList.length ? (
            <LiquidationsList
              fetchItemsFunc={(params) =>
                dispatch(liquidationsActions.fetchWonRaffleList(params))
              }
            >
              {wonRaffleList.map((raffle) => (
                <WonRaffleCard key={raffle.nftMint} raffle={raffle} />
              ))}
            </LiquidationsList>
          ) : (
            <NoWinningRaffles onClick={handleTryLottery} />
          ))}
      </div>
    </div>
  );
};

export default Liquidations;
