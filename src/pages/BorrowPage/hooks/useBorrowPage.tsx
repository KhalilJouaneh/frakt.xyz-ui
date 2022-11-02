import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sum, map } from 'ramda';

import { networkRequest } from '../../../utils/state';
import { BorrowNft } from '../../../state/loans/types';

export enum BorrowType {
  BULK = 'bulk',
  SINGLE = 'single',
}

type BulksKeys = 'best' | 'cheapest' | 'safest' | 'max';

export interface BulkValues extends BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string;
  maxLoanValue: string;
  isCanFreeze: boolean;
  isPriceBased?: boolean;
  solLoanValue?: number;
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
  availableBorrowValue: number;
  onSubmit: () => Promise<void>;
  loading: boolean;
  bulks: BulksType;
  setBorrowValue: Dispatch<SetStateAction<string>>;
  borrowValue: string;
  onBorrowPercentChange: (nextValue: number) => void;
  percentValue: number;
  onBorrowValueChange: (nextValue: string) => void;
  notEnoughBalanceError: boolean;
} => {
  const { publicKey } = useWallet();

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const [availableBorrowValue, setAvailableBorrowValue] = useState<number>(0);
  const [bulks, setBulks] = useState<BulksType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [borrowValue, setBorrowValue] = useState<string>('');
  const [percentValue, setPersentValue] = useState<number>(0);

  const onBorrowPercentChange = (nextValue: number): void => {
    const depositValue = calcValueByBalance(nextValue, availableBorrowValue);

    setBorrowValue(depositValue);
    setPersentValue(nextValue);
  };

  const notEnoughBalanceError =
    Number(borrowValue) > Number(availableBorrowValue.toFixed(2));

  const caclPercentOfBalance = (
    nextValue: string,
    balance: string | number,
  ): void => {
    const percentOfBalance = (parseFloat(nextValue) / Number(balance)) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      setPersentValue(percentOfBalance);
    } else if (percentOfBalance > 100) {
      setPersentValue(100);
    } else {
      setPersentValue(0);
    }
  };

  const onBorrowValueChange = (nextValue: string): void => {
    setBorrowValue(nextValue);
    caclPercentOfBalance(nextValue, availableBorrowValue);
  };

  const calcValueByBalance = (
    nextValue: number,
    balance: string | number,
  ): string => {
    const value = (nextValue * Number(balance)) / 100;
    return value ? value?.toFixed(2) : '0';
  };

  const URL = `https://${process.env.BACKEND_DOMAIN}/nft`;

  const onSubmit = async (): Promise<void> => {
    const totalValue =
      percentValue > 99.5 ? Math.ceil(availableBorrowValue) : borrowValue;

    try {
      const bulks = await networkRequest({
        url: `${URL}/suggest/${publicKey?.toBase58()}?solAmount=${totalValue}`,
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
      const response = await fetch(
        `${URL}/meta/${publicKey?.toBase58()}?&limit=${1000}`,
      );
      const allNfts = await response.json();

      const availableBorrowValue = sum(map(maxLoanValue, allNfts)) || 0;

      setAvailableBorrowValue(availableBorrowValue);
    })();
  }, [publicKey]);

  return {
    availableBorrowValue,
    onSubmit,
    loading,
    bulks,
    setBorrowValue,
    borrowValue,
    onBorrowPercentChange,
    onBorrowValueChange,
    percentValue,
    notEnoughBalanceError,
  };
};

export const marks: { [key: number]: string | JSX.Element } = {
  0: '0 %',
  25: '25 %',
  50: '50 %',
  75: '75 %',
  100: '100 %',
};
