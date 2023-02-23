import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink, useParams } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Loader } from '@frakt/components/Loader';
import { PATHS } from '@frakt/constants';
import { Arrow } from '@frakt/icons';
import { useMarket, useMarketPairs, useWalletBonds } from '@frakt/utils/bonds';

import styles from './MarketPage.module.scss';
import OrderBook from './components/OrderBook/OrderBook';
import { BondsList } from './components/BondsList';
import { MarketInfo } from './components/MarketInfo';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { useBondsTransactions } from '@frakt/hooks/useBondTransactions';

export const MarketPage: FC = () => {
  const wallet = useWallet();

  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey,
  });

  const {
    bonds,
    isLoading: bondsLoanding,
    hideBond,
  } = useWalletBonds({
    walletPubkey: wallet.publicKey,
    marketPubkey: new web3.PublicKey(marketPubkey),
  });

  const { pairs: rawPairs, isLoading: pairsLoading } = useMarketPairs({
    marketPubkey: marketPubkey,
  });

  //? Filter wallet pairs (to prevent selling to yourself)
  const pairs = rawPairs.filter(
    ({ assetReceiver }) => assetReceiver !== wallet?.publicKey?.toBase58(),
  );

  const loading =
    marketLoading || pairsLoading || (wallet.connected && bondsLoanding);

  const { onClaimAll, onRedeem, onExit } = useBondsTransactions({
    bonds,
    hideBond,
    market,
  });

  return (
    <AppLayout>
      {loading && <Loader size="large" />}
      {!loading && (
        <div className={styles.bondPage}>
          <div className={styles.wrapper}>
            <NavLink to={PATHS.BONDS} className={styles.btnBack}>
              <Arrow />
            </NavLink>

            <MarketInfo market={market} bonds={bonds} onClaimAll={onClaimAll} />
          </div>
          {!wallet.connected && (
            <ConnectWalletSection text="Connect your wallet to see your bonds" />
          )}
          <BondsList
            market={market}
            bonds={bonds}
            pairs={pairs}
            onExit={onExit}
            onRedeem={onRedeem}
          />
          <OrderBook market={market} />
        </div>
      )}
    </AppLayout>
  );
};
