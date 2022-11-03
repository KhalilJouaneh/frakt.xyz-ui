import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sum, map } from 'ramda';

import {
  fetchWalletBorrowNfts,
  fetchBulkSuggestion,
  BulkSuggestion,
} from '@frakt/api/nft';

export enum BorrowType {
  BULK = 'bulk',
  SINGLE = 'single',
}

export const useBorrowPage = (): {
  availableBorrowValue: number;
  onSubmit: () => Promise<void>;
  loading: boolean;
  bulks: BulkSuggestion;
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
  const [bulks, setBulks] = useState<BulkSuggestion>(null);
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

  const onSubmit = async (): Promise<void> => {
    const totalValue =
      percentValue > 99.5 ? Math.ceil(availableBorrowValue) : borrowValue;

    try {
      const bulks = await fetchBulkSuggestion({
        publicKey,
        totalValue,
      });

      setBulks(bulks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const walletNfts = await fetchWalletBorrowNfts({
        publicKey,
        limit: 1000,
        offset: 0,
      });

      const availableBorrowValue = sum(map(maxLoanValue, walletNfts)) || 0;

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
