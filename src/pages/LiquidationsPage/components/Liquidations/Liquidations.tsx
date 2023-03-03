import { FC, useMemo } from 'react';

import { useFetchAllRaffleCollections } from '../../hooks';
import { Tabs, useTabs } from '@frakt/components/Tabs';
import UpcomingRaffleTab from '../UpcomingRaffleTab';
import OngoingRaffleTab from '../OngoingRaffleTab';
import styles from './Liquidations.module.scss';
import { RafflesTabsNames } from '../../model';
import WonRaffleTab from '../WonRaffleTab';
import { RAFFLES_TABS } from '.';

const Liquidations: FC = () => {
  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: RAFFLES_TABS,
    defaultValue: RAFFLES_TABS[0].value,
  });

  const { data } = useFetchAllRaffleCollections();

  const renderTip = useMemo(() => {
    const totalRaffles = data?.raffleCollections?.length;

    return totalRaffles
      ? {
          renderTip: {
            tabValue: RafflesTabsNames.ONGOING,
            value: totalRaffles.toString(),
          },
        }
      : {};
  }, [data]);

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
