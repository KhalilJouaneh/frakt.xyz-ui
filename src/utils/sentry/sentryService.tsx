import * as Sentry from '@sentry/browser';
// import * as ReactSentry from '@sentry/react';
import { WalletContextState } from '@solana/wallet-adapter-react';
// import { RouterHistory } from '@sentry/react/types/reactrouter';
// import { Integrations } from '@sentry/tracing';
import { SENTRY_APP_DSN } from './constants';

export const initSentry = (/*history: RouterHistory*/): void => {
  Sentry.init({
    dsn: SENTRY_APP_DSN,
    ignoreErrors: [
      'Registration failed - push service error',
      'We are unable to register the default service worker',
      'The notification permission was not granted and blocked instead',
      'The string did not match the expected pattern',
      'WalletSignTransactionError: User rejected the request.',
    ],
    defaultIntegrations: false,

    // integrations: [
    //   new Integrations.BrowserTracing({
    //     traceXHR: false,
    //     routingInstrumentation:
    //       ReactSentry.reactRouterV5Instrumentation(history),
    //   }),
    // ],

    tracesSampleRate: 1.0,
  });
};

export const captureSentryError = ({
  error,
  wallet,
  transactionName,
  params,
}: {
  error: any;
  wallet?: WalletContextState;
  transactionName: string;
  params?: any;
}): void => {
  const user = wallet?.publicKey?.toBase58();

  if (user) {
    Sentry.setUser({ id: user });
  } else {
    Sentry.setUser(null);
  }

  Sentry.setTag('Transaction name', transactionName);
  Sentry.setContext('Params', params);
  Sentry.setExtra('Transaction logs: ', error?.logs?.join('\n'));
  Sentry.configureScope((scope) => scope.setTransactionName(transactionName));
  Sentry.captureException(error);

  console.error(error);
  // eslint-disable-next-line no-console
  console.warn('Transaction logs: ', error?.logs?.join('\n'));
};
