import { FC, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useLiquidationRaffles } from '../OngoingRaffleTab/hooks';
import { useFetchAllRaffleCollections } from '../../hooks';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import UpcomingRaffleTab from '../UpcomingRaffleTab';
import OngoingRaffleTab from '../OngoingRaffleTab';
import styles from './Liquidations.module.scss';
import { RafflesTabsNames } from '../../model';
import WonRaffleTab from '../WonRaffleTab';
import { RAFFLES_TABS } from '.';
import {
  selectSocket,
  selectWalletPublicKey,
} from '../../../../state/common/selectors';

const Liquidations: FC = () => {
  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: RAFFLES_TABS,
    defaultValue: RAFFLES_TABS[0].value,
  });

  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);

  useFetchAllRaffleCollections();

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('lottery-tickets-subscribe', publicKey);
    }
  }, [socket, publicKey]);

  const { raffles } = useLiquidationRaffles();

  const renderTip = useMemo(() => {
    return raffles?.length
      ? {
          renderTip: {
            tabValue: RafflesTabsNames.ONGOING,
            value: raffles?.length.toString(),
          },
        }
      : {};
  }, [raffles]);

  return (
    <div className={styles.content}>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        {...renderTip}
      />
      <div className={styles.tabContent}>
        {tabValue === RafflesTabsNames.ONGOING && <OngoingRaffleTab />}
        {tabValue === RafflesTabsNames.UPCOMING && <UpcomingRaffleTab />}
        {tabValue === RafflesTabsNames.HISTORY && <WonRaffleTab />}
      </div>
    </div>
  );
};

export default Liquidations;
