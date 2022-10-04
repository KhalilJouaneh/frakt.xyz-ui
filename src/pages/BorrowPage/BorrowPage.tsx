import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOL_TOKEN } from '@frakt-protocol/frakt-sdk';

import { ConnectWalletSection } from '../../components/ConnectWalletSection';
import { TokenFieldWithBalance } from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import { networkRequest } from '../../utils/state';
import BorrowBulk from './components/BorrowBulk';
import BorrowNft from './components/BorrowNft';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { loansActions } from '../../state/loans/actions';
import { LinkWithArrow } from '../../components/LinkWithArrow';
import { Loader } from '../../components/Loader';

enum BorrowType {
  BULK = 'bulk',
  SINGLE = 'single',
}

type BulksKeys = 'best' | 'cheapest' | 'safest';
export type BulkValues = {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string;
  maxLoanValue: string;
  isCanFreeze: boolean;
  isPriceBased: boolean;
  parameters: {
    suggestedLoanValue: number;
    liquidityPoolPubkey: string;
    ltvPercents: number;
    borrowAPRPercents: number;
    collaterizationRate: number;
  };
};

export type BulksType = { [key in BulksKeys]: BulkValues[] };

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowPage: FC = () => {
  const { publicKey, connected } = useWallet();
  const dispatch = useDispatch();

  const [borrowType, setBorrowType] = useState<BorrowType>(null);
  const [bulks, setBulks] = useState<BulksType>(null);
  const [value, setValue] = useState<string>('');

  const [nftsLoading, setNftsLoading] = useState<boolean>(true);

  const onSubmit = async (): Promise<void> => {
    try {
      const bulks = await networkRequest({
        url: `https://${
          process.env.BACKEND_DOMAIN
        }/nft/suggest/${publicKey?.toBase58()}?solAmount=${value}`,
      });

      setBulks(bulks as BulksType);
    } catch (error) {
      console.log(error);
    } finally {
      setNftsLoading(false);
    }
  };

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

          {!connected && (
            <ConnectWalletSection text="Connect your wallet to check ..." />
          )}

          {connected && (
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
                    onClick={() => {
                      onSubmit();
                      setBorrowType(BorrowType.BULK);
                    }}
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
                <p className={styles.blockSubtitle}>
                  I just want to make a loan
                </p>
                <Button
                  onClick={() => {
                    setBorrowType(BorrowType.SINGLE);
                    dispatch(loansActions.setBulkNfts(null));
                  }}
                  className={styles.btnConfirm}
                  type="secondary"
                >
                  Try it now
                </Button>
              </div>
            </div>
          )}
        </AppLayout>
      )}

      {borrowType === BorrowType.BULK && (
        <AppLayout>
          {!!bulks?.best?.length && (
            <BorrowBulk
              onBack={() => setBorrowType(BorrowType.SINGLE)}
              onClick={() => setBorrowType(null)}
              value={value}
              bulks={bulks}
            />
          )}

          {!!nftsLoading && <Loader size="large" />}

          {!nftsLoading && !bulks?.best?.length && (
            <>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>Tiltle 1</h1>
                  <h2 className={styles.subtitle}>I need {value} SOL</h2>
                </div>
              </div>

              <div className={styles.noSuiableMessageWrapper}>
                <p className={styles.noSuiableMessage}>
                  No suitable NFTs found
                </p>
                <LinkWithArrow
                  className={styles.acceptedCollectionsLink}
                  label="Check collections accepted for loans"
                  to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
                  externalLink
                />
              </div>
            </>
          )}
        </AppLayout>
      )}
      {borrowType === BorrowType.SINGLE && (
        <BorrowNft onClick={() => setBorrowType(null)} />
      )}
    </>
  );
};

export default BorrowPage;
