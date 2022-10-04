//? Comment to trigger vercel env build
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
} from '@solana/wallet-adapter-wallets';
import { SentreWalletAdapter } from '@sentre/connector';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { FC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { IntercomProvider } from 'react-use-intercom';

import { Router } from './router';
import store from './state/store';
import { ENDPOINT } from './config';
// import { IntercomService, INTERCOM_APP_ID } from './utils/intercom';
// import { createBrowserHistory } from 'history';
import { initSentry } from './utils/sentry';
import { initAmplitude } from './utils/amplitude';
import Confetti from './components/Confetti';

// const history = createBrowserHistory();

initSentry(/*history*/);
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
  new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
];

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <ConnectionProvider endpoint={ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          <QueryClientProvider client={queryClient}>
            {/* <IntercomProvider appId={INTERCOM_APP_ID}> */}
            <Router />
            <Confetti />
            {/* <IntercomService /> */}
            {/* </IntercomProvider> */}
          </QueryClientProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ReduxProvider>
  );
};

export default App;
