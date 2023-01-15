import { FC } from 'react';

import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import { TokenFieldWithBalance } from '@frakt/components/TokenField';
import { AppLayout } from '@frakt/components/Layout/AppLayout';
import Button from '@frakt/components/Button';
import { Slider } from '@frakt/components/Slider';
import { SOL_TOKEN } from '@frakt//utils';

import { BorrowHeader } from '../components/BorrowHeader';
import styles from './BorrowRootPage.module.scss';
import { useBorrowRootPage } from './hooks';
import { Loader } from '@frakt/components/Loader';

export const BorrowRootPage: FC = () => {
  const {
    borrowValue,
    borrowPercentValue,
    onBorrowValueChange,
    onBorrowPercentChange,
    maxBorrowValue,
    loading,
    isNotEnoughBalanceError,
    isWalletConnected,
    goToBulkSuggestionPage,
    goToBorrowManualPage,
  } = useBorrowRootPage();

  return (
    <AppLayout>
      <BorrowHeader
        title="Borrow SOL"
        subtitle="Choose how you want to borrow"
      />

      {!isWalletConnected && (
        <ConnectWalletSection text="Connect your wallet to check ..." />
      )}

      {isWalletConnected && loading && <Loader size="large" />}

      {isWalletConnected && !loading && (
        <div className={styles.wrapper}>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Pick for me</h3>
            <p className={styles.blockSubtitle}>I need...</p>
            <div className={styles.blockContent}>
              <TokenFieldWithBalance
                className={styles.input}
                value={borrowValue}
                onValueChange={onBorrowValueChange}
                currentToken={SOL_TOKEN}
                label="Available to borrow:"
                lpBalance={Number(maxBorrowValue?.toFixed(2))}
                showMaxButton
                error={isNotEnoughBalanceError}
                labelRight
              />
              <div className={styles.errors}>
                {isNotEnoughBalanceError && <p>Not enough NFTs</p>}
              </div>

              <Slider
                value={borrowPercentValue}
                setValue={onBorrowPercentChange}
                className={styles.slider}
                marks={{
                  0: '0 %',
                  25: '25 %',
                  50: '50 %',
                  75: '75 %',
                  100: '100 %',
                }}
                withTooltip
              />

              <Button
                onClick={goToBulkSuggestionPage}
                disabled={!borrowValue}
                className={styles.btn}
                type="secondary"
              >
                {"Let's go"}
              </Button>
            </div>
          </div>
          <div className={styles.separator}>OR</div>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Select NFTs manually</h3>
            <p className={styles.blockSubtitle}></p>
            <Button
              onClick={goToBorrowManualPage}
              className={styles.btnConfirm}
              type="secondary"
            >
              Select
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
