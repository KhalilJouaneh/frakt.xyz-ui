import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs } from '@frakt/components/Tabs';

import { MarketTable } from './components/MarketTable/MarketTable';
import { useMarketPage, useMarketsPreview } from './hooks';
import MyBondsWidgets from './components/MyBondsWidgets';
import { Header } from './components/Header';

import styles from './MarketsPage.module.scss';

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

  const { marketTabs, tabValue, setTabValue } = useMarketPage();

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
          {tabValue === MarketTabsNames.BONDS && (
            <>
              <MyBondsWidgets onClick={null} />
              <MarketTable
                className={styles.table}
                loading={isLoading}
                data={marketsPreview}
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
