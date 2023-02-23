import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { filter } from 'lodash';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs } from '@frakt/components/Tabs';
import { useConnection } from '@frakt/hooks';

import { MarketTable } from './components/MarketTable/MarketTable';
import { useMarketPage, useMarketsPreview } from './hooks';
import MyBondsWidgets from './components/MyBondsWidgets';
import { Header } from './components/Header';

import styles from './MarketsPage.module.scss';
import {
  isBondAvailableToRedeem,
  redeemAllBonds,
  useMarket,
  useMarketPairs,
  useWalletBonds,
} from '@frakt/utils/bonds';
import { BondsTable } from '../MarketPage/components/BondsList/components/BondsTable';
import { web3 } from 'fbonds-core';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

export enum MarketTabsNames {
  COLLECTIONS = 'collections',
  OFFERS = 'offers',
  BONDS = 'bonds',
}

const marketPubkey = 'CEKGS2Ez83EP2E5QRYj6457euRAZwVxozRGkZvZNPUHR';

const MarketsPreviewPage: FC = () => {
  const wallet = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview({
    walletPublicKey: wallet?.publicKey,
  });

  const { marketTabs, tabValue, setTabValue } = useMarketPage();

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  console.log(bonds);

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey: marketPubkey,
  });

  const { pairs: rawPairs, isLoading: pairsLoading } = useMarketPairs({
    marketPubkey,
  });

  const pairs = rawPairs.filter(
    ({ assetReceiver }) => assetReceiver !== wallet?.publicKey?.toBase58(),
  );

  const { onClaimAll, onRedeem, onExit } = useBondsTransactions({
    bonds,
    hideBond,
    market,
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
          {tabValue === MarketTabsNames.BONDS && (
            <>
              <MyBondsWidgets onClick={onClaimAll} />
              <BondsTable
                className={styles.table}
                loading={isLoading || bondsLoanding}
                data={bonds}
                onExit={onExit}
                onRedeem={onRedeem}
                market={market}
                pairs={pairs}
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
