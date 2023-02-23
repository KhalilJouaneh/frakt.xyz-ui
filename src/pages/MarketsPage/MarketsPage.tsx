import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { web3 } from 'fbonds-core';

import { useMarket, useMarketPairs, useWalletBonds } from '@frakt/utils/bonds';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Tabs } from '@frakt/components/Tabs';

import { BondsTable } from '../MarketPage/components/BondsList/components/BondsTable';
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

const marketPubkey = 'CEKGS2Ez83EP2E5QRYj6457euRAZwVxozRGkZvZNPUHR';

const MarketsPreviewPage: FC = () => {
  const { publicKey, connected } = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview({
    walletPublicKey: publicKey,
  });

  const { marketTabs, tabValue, setTabValue } = useMarketPage();

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useWalletBonds({
    walletPubkey: publicKey,
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey: marketPubkey,
  });

  const { pairs: rawPairs, isLoading: pairsLoading } = useMarketPairs({
    marketPubkey,
  });

  const pairs = rawPairs.filter(
    ({ assetReceiver }) => assetReceiver !== publicKey?.toBase58(),
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
              {!connected && (
                <ConnectWalletSection text="Connect your wallet to check my bonds" />
              )}
              {connected && (
                <>
                  <MyBondsWidgets onClick={onClaimAll} />
                  <BondsTable
                    className={classNames(styles.table, styles.bondsTable)}
                    loading={isLoading}
                    data={bonds}
                    onExit={onExit}
                    onRedeem={onRedeem}
                    market={market}
                    pairs={pairs}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
