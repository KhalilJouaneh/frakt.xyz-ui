import { FC } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import NoSuitableNft from '@frakt/pages/BorrowPage/components/NoSuitableNft';
import { Loader } from '@frakt/components/Loader';
import { BorrowNft, BulkSuggestion, BulkTypes } from '@frakt/api/nft';
import { ConnectWalletSection } from '@frakt/components/ConnectWalletSection';
import Button from '@frakt/components/Button';
import Tooltip from '@frakt/components/Tooltip';

import { BorrowHeader } from '../components/BorrowHeader';
import { calcBulkTotalValue } from '../helpers';
import { useBorrowBulkSuggestionPage } from './hooks';
import styles from './BorrowBulkSuggestionPage.module.scss';

export const BorrowBulkSuggestionPage: FC = () => {
  const {
    borrowValue,
    bulkSuggestion,
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
            {Object.entries(bulkSuggestion).map(([type, bulk]) => (
              <BulkSuggestion
                key={type}
                type={type as BulkTypes}
                bulk={bulk}
                onSelectClick={() => onBulkSuggestionSelect(bulk)}
              />
            ))}
          </div>
        )}
      </>
    </AppLayout>
  );
};

interface BulkSuggestionProps {
  bulk: BorrowNft[];
  type: BulkTypes;
  onSelectClick: () => void;
}
const BulkSuggestion: FC<BulkSuggestionProps> = ({
  bulk,
  type,
  onSelectClick,
}) => {
  const { className, title, text } = BADGES_INFO?.[type] || BADGES_INFO.DEFAULT;
  const borrowValue = calcBulkTotalValue(bulk);

  return (
    <Tooltip placement="top" trigger="hover" overlay={text}>
      <div className={styles.blockWrapper}>
        <div className={classNames(styles.block, className)}>
          <div>
            <div className={styles.badge}>{title}</div>
            <h4 className={styles.value}>
              Borrow {borrowValue.toFixed(2)} SOL
            </h4>
            <div className={styles.nfts}>
              {(bulk || []).map(({ imageUrl }) => (
                <img key={imageUrl} src={imageUrl} className={styles.icon} />
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
