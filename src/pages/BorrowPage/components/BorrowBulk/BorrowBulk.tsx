import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sum, map, filter } from 'ramda';

import { BulksType, BulkValues } from '../../BorrowPage';
import Button from '../../../../components/Button';
import styles from './BorrowBulk.module.scss';
import SelectedBulk from '../SelectedBulk';
import Header from '../Header';

interface BorrowBulk {
  bulks: BulksType;
  value: number;
  onClick: () => void;
  onBack: () => void;
}

const BorrowBulk: FC<BorrowBulk> = ({ bulks, value, onClick, onBack }) => {
  const { connected } = useWallet();

  const [selectedBulk, setSelectedBulk] = useState<BulkValues[]>([]);

  const getTotalValue = (bulk): number => {
    const priceBased = ({ priceBased }) => priceBased;
    const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
    const timeBased = ({ isPriceBased }) => !isPriceBased;
    const suggestedLoanValue = ({ priceBased }) =>
      priceBased.suggestedLoanValue;

    const priceBasedLoans = filter(priceBased, bulk);
    const timeBasedLoans = filter(timeBased, bulk);

    const priceBasedLoansValue = sum(map(suggestedLoanValue, priceBasedLoans));

    const timeBasedLoansValue = sum(map(maxLoanValue, timeBasedLoans));

    return priceBasedLoansValue + timeBasedLoansValue || 0;
  };

  const bestBulk = bulks?.best || [];
  const cheapestBulk = bulks?.cheapest || [];
  const safestBulk = bulks?.safest || [];

  const bestBulkValue = getTotalValue(bestBulk);
  const cheapestBulkValue = getTotalValue(cheapestBulk);
  const safestBulkValue = getTotalValue(safestBulk);

  const getBulkValues = (bulk: BulkValues[], value: number) => {
    if (!bulk.length) return;

    return (
      <div className={styles.block}>
        <div>
          <h4 className={styles.value}>Borrow {value.toFixed(2)} SOL</h4>
          <div className={styles.nfts}>
            {(bulk || []).map(({ imageUrl }) => (
              <img key={imageUrl} src={imageUrl} className={styles.icon} />
            ))}
          </div>
        </div>
        <Button
          onClick={() => setSelectedBulk(bulk)}
          type="secondary"
          className={styles.btn}
        >
          Select
        </Button>
      </div>
    );
  };

  return (
    <>
      {!selectedBulk?.length ? (
        <>
          <Header
            onClick={onClick}
            title="Borrowing"
            subtitle={`I need ${value} SOL`}
          />
          {connected && !!bulks.best.length && (
            <div className={styles.wrapper}>
              {getBulkValues(bestBulk, bestBulkValue)}
              {getBulkValues(cheapestBulk, cheapestBulkValue)}
              {getBulkValues(safestBulk, safestBulkValue)}
            </div>
          )}
        </>
      ) : (
        <SelectedBulk
          onBack={onBack}
          onClick={() => setSelectedBulk(null)}
          selectedBulk={selectedBulk}
        />
      )}
    </>
  );
};

export default BorrowBulk;
