import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { useFetchAllUserBonds } from '@frakt/utils/bonds';
import EmptyList from '@frakt/components/EmptyList';
import { Tabs, useTabs } from '@frakt/components/Tabs';

import { MarketTabsNames, MARKET_TABS, useMarketsPreview } from './hooks';
import { MarketTable } from './components/MarketTable/MarketTable';
import { BondsTable } from '../MarketPage/components/BondsTable';
import MyBondsWidgets from './components/MyBondsWidgets';
import { createMyBondsStats } from './helpers';
import { Header } from './components/Header';

import styles from './MarketsPage.module.scss';

const MarketsPreviewPage: FC = () => {
  const { publicKey, connected } = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview({
    walletPublicKey: publicKey,
  });

  const {
    tabs: marketTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: MARKET_TABS,
    defaultValue: MARKET_TABS[0].value,
  });

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useFetchAllUserBonds({
    walletPubkey: publicKey,
  });

  const { onClaimAll } = useBondsTransactions({
    bonds,
    hideBond,
  });

  const { rewards, locked, activeLoans } = createMyBondsStats(bonds);

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
        <div
          className={classNames(styles.tabContent, {
            [styles.tabContentMinHeight]:
              tabValue === MarketTabsNames.COLLECTIONS,
          })}
        >
          {tabValue === MarketTabsNames.COLLECTIONS && (
            <MarketTable
              className={styles.table}
              loading={isLoading}
              data={marketsPreview}
            />
          )}
          {tabValue === MarketTabsNames.BONDS && (
            <>
              {!connected && (
                <ConnectWalletSection
                  className={styles.emptyList}
                  text="Connect your wallet to see my bonds"
                />
              )}

              {connected && (
                <>
                  <MyBondsWidgets
                    locked={locked}
                    activeLoans={activeLoans}
                    rewards={rewards}
                    onClick={onClaimAll}
                  />
                  <BondsTable
                    className={classNames(styles.table, styles.bondsTable)}
                    noDataClassName={styles.noDataTableMessage}
                    loading={isLoading || bondsLoanding}
                    data={bonds}
                    haderTitleCellClassName={styles.haderTitleCell}
                    mobileBreakpoint={1190}
                  />
                </>
              )}

              {connected && !bonds.length && (isLoading || bondsLoanding) && (
                <EmptyList
                  className={styles.emptyList}
                  text="You don't have any bonds"
                />
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
