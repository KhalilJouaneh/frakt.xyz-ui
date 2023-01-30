import { Component, ErrorInfo, FC, ReactNode } from 'react';

import Button from '@frakt/components/Button';
import { copyToClipboard } from '@frakt/utils';

import sadPepeImg from './sad_pepe.png';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children?: ReactNode;
}

interface State {
  error?: SolanaError;
}

interface SolanaError extends Error {
  logs?: Array<string>;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: SolanaError): State {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public componentDidCatch(error: SolanaError, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.error) {
      return <ErrorPlaceholder error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorPlaceholderProps {
  error: SolanaError;
}
const ErrorPlaceholder: FC<ErrorPlaceholderProps> = ({ error }) => {
  const errorText = [
    error.name,
    error.message,
    error?.cause,
    error?.logs?.join('\n'),
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <img className={styles.image} src={sadPepeImg} alt="Sad Pepe" />
        <h1 className={styles.title}>Something unexpected happened</h1>
        <h2 className={styles.subtitle}>
          You can create a support ticket on{' '}
          <a
            href={process.env.FRAKT_DISCORD_SERVER}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.discordLink}
          >
            our discord server
          </a>{' '}
          and send us this error text
        </h2>
        <pre className={styles.errorMessage}>{errorText}</pre>
        <Button type="secondary" onClick={() => copyToClipboard(errorText)}>
          Copy error
        </Button>
      </div>
    </div>
  );
};
