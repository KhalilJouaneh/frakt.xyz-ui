import { FC } from 'react';
import { sum, map } from 'lodash';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import { Loader } from '@frakt/components/Loader';
import { BulkSuggestion, BulkTypes, Suggestion } from '@frakt/api/nft';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';

import { BorrowHeader } from '../components/BorrowHeader';
import { NoSuitableNft } from '../components/NoSuitableNft';
import { useBorrowBulkSuggestionPage } from './hooks';
import styles from './BorrowBulkSuggestionPage.module.scss';

export const BorrowBulkSuggestionPage: FC = () => {
  const {
    borrowValue,
    suggestions,
    loading,
    isBulkExist,
    isWalletConnected,
    onBackBtnClick,
    onBulkSuggestionSelect,
  } = useBorrowBulkSuggestionPage();

  return (
    <AppLayout>
      <>
        <BorrowHeader
          onBackBtnClick={onBackBtnClick}
          title="Borrowing"
          subtitle={`I need ${borrowValue.toFixed(2)} SOL`}
        />

        {!isWalletConnected && (
          <ConnectWalletSection text="Connect your wallet to check ..." />
        )}

        {isWalletConnected && loading && <Loader size="large" />}

        {isWalletConnected && !loading && !isBulkExist && <NoSuitableNft />}

        {isWalletConnected && !loading && isBulkExist && (
          <div className={styles.wrapper}>
            {Object.entries(suggestions).map(([type, suggestion]) => (
              <BulkSuggestion
                key={type}
                type={type as BulkTypes}
                suggestion={suggestion}
                onSelectClick={() => onBulkSuggestionSelect(suggestion)}
              />
            ))}
          </div>
        )}
      </>
    </AppLayout>
  );
};

interface BulkSuggestionProps {
  suggestion: Suggestion;
  type: BulkTypes;
  onSelectClick: () => void;
}
const BulkSuggestion: FC<BulkSuggestionProps> = ({
  suggestion,
  type,
  onSelectClick,
}) => {
  const { className, title, text } = BADGES_INFO?.[type] || BADGES_INFO.DEFAULT;

  const borrowValue = sum(map(suggestion.orders, ({ loanValue }) => loanValue));

  return (
    <Tooltip placement="top" trigger="hover" overlay={text}>
      <div className={styles.blockWrapper}>
        <div className={classNames(styles.block, className)}>
          <div>
            <div className={styles.badge}>{title}</div>
            <h4 className={styles.value}>
              Borrow {(borrowValue / 1e9).toFixed(2)} SOL
            </h4>
            <div className={styles.nfts}>
              {(suggestion?.orders || []).map(({ borrowNft }) => (
                <img
                  key={borrowNft.imageUrl}
                  src={borrowNft.imageUrl}
                  className={styles.icon}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={onSelectClick}
            type="secondary"
            className={styles.btn}
          >
            Select
          </Button>
        </div>
      </div>
    </Tooltip>
  );
};

const BADGES_INFO: Record<
  BulkTypes | 'DEFAULT',
  {
    title: string;
    text: string;
    className: string;
  }
> = {
  best: {
    title: 'Best',
    text: 'Most appropriate to chosen SOL amount',
    className: styles.blockBest,
  },
  max: {
    title: 'Max',
    text: 'Maximum available loan to value',
    className: styles.blockBest,
  },
  cheapest: {
    title: 'Cheapest',
    text: 'Minimal fees paid',
    className: styles.blockCheapest,
  },
  safest: {
    title: 'Safest',
    text: 'Loans with lowest loan to value ratio',
    className: styles.blockSafest,
  },
  DEFAULT: {
    title: '',
    text: '',
    className: '',
  },
};
