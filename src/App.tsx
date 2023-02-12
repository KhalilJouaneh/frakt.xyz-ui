//? Comment to trigger vercel env build 5
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
  ExodusWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SentreWalletAdapter } from '@sentre/connector';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from '@frakt/router';
import store from '@frakt/state/store';
import { ENDPOINT } from '@frakt/config';
import { initSentry } from '@frakt/utils/sentry';
import { initAmplitude } from '@frakt/utils/amplitude';
import Confetti from '@frakt/components/Confetti';
import { ErrorBoundary } from '@frakt/components/ErrorBoundary';

initSentry();
initAmplitude();

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new SlopeWalletAdapter(),
  new GlowWalletAdapter(),
  new LedgerWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TorusWalletAdapter(),
  new MathWalletAdapter(),
  new ExodusWalletAdapter(),
  new SentreWalletAdapter(),
  new BackpackWalletAdapter(),
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ConnectionProvider endpoint={ENDPOINT}>
          <WalletProvider wallets={wallets} autoConnect>
            <QueryClientProvider client={queryClient}>
              <Router />
              <Confetti />
            </QueryClientProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;
