import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sum, map } from 'ramda';

import { AppLayout } from '../../../../components/Layout/AppLayout';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { BulksType, BulkValues } from '../../BorrowPage';
import Button from '../../../../components/Button';
import styles from './BorrowBulk.module.scss';
import SelectedBulk from '../SelectedBulk';
import Icons from '../../../../iconsNew';

interface BorrowBulk {
  bulks: BulksType;
  value: string;
  onClick: () => void;
  onBack: () => void;
}

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowBulk: FC<BorrowBulk> = ({ bulks, value, onClick, onBack }) => {
  const { connected } = useWallet();

  const { best, cheapest, safest } = bulks;

  const [selectedBulk, setSelectedBulk] = useState<BulkValues[]>([]);

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const bestBulkValue = sum(map(maxLoanValue, best));
  const cheapestBulkValue = sum(map(maxLoanValue, cheapest));
  const safestBulkValue = sum(map(maxLoanValue, safest));

  const getBulkValues = ({
    bulk,
    value,
  }: {
    bulk: BulkValues[];
    value: number;
  }) => {
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

          {connected && !bulks.best.length && (
            <div className={styles.noSuiableMessageWrapper}>
              <p className={styles.noSuiableMessage}>No suitable NFTs found</p>
              <LinkWithArrow
                className={styles.acceptedCollectionsLink}
                label="Check collections accepted for loans"
                to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
                externalLink
              />
            </div>
          )}

          {connected && !!bulks.best.length && (
            <div className={styles.wrapper}>
              {getBulkValues({ bulk: best, value: bestBulkValue })}
              {getBulkValues({ bulk: cheapest, value: cheapestBulkValue })}
              {getBulkValues({ bulk: safest, value: safestBulkValue })}
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
    </AppLayout>
  );
};

export default BorrowBulk;
