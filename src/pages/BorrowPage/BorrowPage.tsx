import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';

import { AppLayout } from '../../components/Layout/AppLayout';
import { TokenFieldWithBalance } from '../../components/TokenField';
import BorrowNft from './components/BorrowNft';
import { networkRequest } from '../../utils/state';
import BorrowBulk from './components/BorrowBulk';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';

enum BorrowType {
  BULK = 'bulk',
  JUST = 'just',
}

const BorrowPage: FC = () => {
  const [borrowType, setBorrowType] = useState<BorrowType>(null);
  const { publicKey } = useWallet();
  const [bulks, setBulks] = useState<any>({});
  const [value, setValue] = useState<string>('');

  const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

  useEffect(() => {
    (async () => {
      const bulks = await networkRequest({
        url: `https://${BACKEND_DOMAIN}/nft/suggest/${publicKey?.toBase58()}?solAmount=${value}`,
      });

      setBulks(bulks);
    })();
  }, [value]);

  return (
    <>
      {borrowType === null && (
        <AppLayout>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Borrow money</h1>
              <h2 className={styles.subtitle}>
                Select your NFT to use as a collateral
              </h2>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Decide for me</h3>
              <p className={styles.blockSubtitle}>I need...</p>
              <div className={styles.blockContent}>
                <div className={styles.input}>
                  <TokenFieldWithBalance
                    value={value}
                    onValueChange={(e) => setValue(e)}
                    currentToken={SOL_TOKEN}
                  />
                </div>
                <Button
                  onClick={() => setBorrowType(BorrowType.BULK)}
                  disabled={!value}
                  className={styles.btn}
                  type="secondary"
                >
                  Confirm
                </Button>
              </div>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Title 2</h3>
              <p className={styles.blockSubtitle}>I just want to make a loan</p>
              <Button
                onClick={() => setBorrowType(BorrowType.JUST)}
                className={styles.btnConfirm}
                type="secondary"
              >
                Try it now
              </Button>
            </div>
          </div>
        </AppLayout>
      )}

      {borrowType === BorrowType.BULK && bulks?.best && (
        <BorrowBulk
          onClick={() => setBorrowType(null)}
          value={value}
          bulks={bulks}
        />
      )}
      {borrowType === BorrowType.JUST && (
        <BorrowNft onClick={() => setBorrowType(null)} />
      )}
    </>
  );
};

export default BorrowPage;
