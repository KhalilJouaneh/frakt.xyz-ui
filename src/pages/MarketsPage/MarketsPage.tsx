import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { Loader } from '@frakt/components/Loader';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Header } from './components/Header';
import { useMarketsPreview } from './hooks';
import styles from './MarketsPage.module.scss';
import { MarketTable } from './components/MarketTable/MarketTable';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const MarketsPreviewPage: FC = () => {
  const wallet = useWallet();

  const { marketsPreview, isLoading } = useMarketsPreview({
    walletPublicKey: wallet?.publicKey,
  });

  return (
    <AppLayout>
      <Header title="Bonds" subtitle="Lend on your own terms" />

      <div className={styles.markets}>
        {isLoading && <Loader size="large" />}
        <MarketTable data={marketsPreview} />
        {/* {!isLoading &&
          marketsPreview.map((marketPreview) => (
            <MarketPreviewCard
              key={marketPreview.marketPubkey}
              marketPreview={marketPreview}
            />
          ))} */}
      </div>
    </AppLayout>
  );
};

export default MarketsPreviewPage;
