import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { Loader } from '@frakt/components/Loader';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Header } from './components/Header';
import { useMarketsPreview } from './hooks';
import styles from './MarketsPage.module.scss';
import { MarketTable } from './components/MarketTable/MarketTable';
import { Tab, Tabs, useTabs } from '@frakt/components/Tabs';
import { BondsTable } from '../MarketPage/components/BondsList/components/BondsTable';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

export enum MarketTabsNames {
  COLLECTIONS = 'collections',
  OFFERS = 'offers',
  BONDS = 'bonds',
}

const MarketsPreviewPage: FC = () => {
  const wallet = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview({
    walletPublicKey: wallet?.publicKey,
  });

  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: MARKET_TABS,
    defaultValue: MARKET_TABS[0].value,
  });

  return (
    <AppLayout>
      <Header title="Bonds" subtitle="Lend on your own terms" />

      <div className={styles.content}>
        <Tabs
          className={styles.tab}
          tabs={marketTabs}
          value={tabValue}
          setValue={setTabValue}
        />
        <div className={styles.tabContent}>
          {tabValue === MarketTabsNames.COLLECTIONS && (
            <MarketTable
              className={styles.table}
              loading={isLoading}
              data={marketsPreview}
            />
          )}
          {tabValue === MarketTabsNames.OFFERS && (
            <MarketTable
              className={styles.table}
              loading={isLoading}
              data={marketsPreview}
            />
          )}
          {/* {tabValue === MarketTabsNames.BONDS && (
            <BondsTable
              // className={styles.table}
              // loading={isLoading}
              data={marketsPreview}
            />
          )} */}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;

export const MARKET_TABS: Tab[] = [
  {
    label: 'Collections',
    value: 'collections',
  },
  {
    label: 'My Bonds',
    value: 'bonds',
  },
];
