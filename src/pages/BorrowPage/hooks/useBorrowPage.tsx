import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { sum, map } from 'ramda';
import { useWallet } from '@solana/wallet-adapter-react';

import { useBorrowNft } from '../components/BorrowManual/hooks';
import styles from '../BorrowPage.module.scss';
import { SolanaIcon } from '../../../icons';
import { networkRequest } from '../../../utils/state';
import { BorrowNft } from '../../../state/loans/types';

export enum BorrowType {
  BULK = 'bulk',
  SINGLE = 'single',
}

type BulksKeys = 'best' | 'cheapest' | 'safest';

export interface BulkValues extends BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string;
  maxLoanValue: string;
  isCanFreeze: boolean;
  isPriceBased?: boolean;
  timeBased: {
    returnPeriodDays: number;
    ltvPercents: number;
    fee: string;
    feeDiscountPercents: string;
    repayValue: string;
    liquidityPoolPubkey: string;
    loanValue: string;
    isCanStake: boolean;
  };
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number;
    borrowAPRPercents: number;
    collaterizationRate: number;
    isCanStake: boolean;
    ltv?: number;
    suggestedLoanValue?: number;
  };
}

export type BulksType = { [key in BulksKeys]: BulkValues[] };

export const useBorrowPage = (): {
  availableBorrowValue: string | number;
  marks: { [key: number]: string | JSX.Element };
  onSubmit: () => Promise<void>;
  loading: boolean;
  bulks: BulksType;
  setBorrowValue: Dispatch<SetStateAction<number>>;
  borrowValue: number;
} => {
  const { publicKey } = useWallet();

  const { fetchData } = useBorrowNft();
  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const [availableBorrowValue, setAvailableBorrowValue] = useState<
    number | string
  >(0);
  const [bulks, setBulks] = useState<BulksType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [borrowValue, setBorrowValue] = useState<number>(0);

  const onSubmit = async (): Promise<void> => {
    try {
      const bulks = await networkRequest({
        url: `https://${
          process.env.BACKEND_DOMAIN
        }/nft/suggest/${publicKey?.toBase58()}?solAmount=${borrowValue}`,
      });

      setBulks(bulks as BulksType);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const allNfts = await fetchData({ offset: 0, limit: 1000 });
      const availableBorrowValue =
        sum(map(maxLoanValue, allNfts)).toFixed(1) || 0;

      setAvailableBorrowValue(availableBorrowValue);
    })();
  }, []);

  const marks = {
    0: (
      <div className={styles.mark}>
        0 <SolanaIcon />
      </div>
    ),
    [availableBorrowValue || 0]: (
      <div className={styles.mark}>
        {availableBorrowValue} <SolanaIcon />
      </div>
    ),
  };

  return {
    availableBorrowValue,
    marks,
    onSubmit,
    loading,
    bulks,
    setBorrowValue,
    borrowValue,
  };
};
