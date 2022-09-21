import { FC, useState } from 'react';
import { sum, map } from 'ramda';

import { AppLayout } from '../../../../components/Layout/AppLayout';
import Button from '../../../../components/Button';
import styles from './BorrowBulk.module.scss';
import Icons from '../../../../iconsNew';
import SelectedBulk from '../SelectedBulk';

interface BorrowBulk {
  bulks: any;
  value: string;
  onClick: () => void;
}

const BorrowBulk: FC<BorrowBulk> = ({ bulks, value, onClick }) => {
  const { best, cheapest, safest } = bulks;

  const [selectedBulk, setSelectedBulk] = useState<any>();

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const bestBulkValue = sum(map(maxLoanValue, best));
  const cheapestBulkValue = sum(map(maxLoanValue, cheapest));
  const safestBulkValue = sum(map(maxLoanValue, safest));

  const getBulk = ({ bulk, value }: { bulk: any; value: number }) => {
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
    <AppLayout>
      {!selectedBulk?.length ? (
        <>
          <div onClick={onClick} className={styles.btnBack}>
            <Icons.Arrow />
          </div>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Tiltle 1</h1>
              <h2 className={styles.subtitle}>I need {value} SOL</h2>
            </div>
          </div>
          <div className={styles.wrapper}>
            {getBulk({ bulk: best, value: bestBulkValue })}
            {getBulk({ bulk: cheapest, value: cheapestBulkValue })}
            {getBulk({ bulk: safest, value: safestBulkValue })}
          </div>
        </>
      ) : (
        <SelectedBulk
          onClick={() => setSelectedBulk(null)}
          selectedBulk={selectedBulk}
        />
      )}
    </AppLayout>
  );
};

export default BorrowBulk;
