import { useEffect, useMemo } from 'react';
import { web3 } from 'fbonds-core';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';

import {
  BulkSuggestion,
  fetchBulkSuggestion,
  Suggestion,
} from '@frakt/api/nft';
import { PATHS } from '@frakt/constants';

import { Order, useBorrow } from '../cartState';
import { LoanType } from '@frakt/api/loans';

type UseBulkSuggestion = (props: {
  walletPublicKey?: web3.PublicKey;
  borrowValue?: number;
}) => {
  bulkSuggestion: BulkSuggestion;
  isLoading: boolean;
};
const useBulkSuggestion: UseBulkSuggestion = ({
  walletPublicKey,
  borrowValue = 0,
}) => {
  const { data, isLoading } = useQuery(
    ['bulkSuggestion', walletPublicKey?.toBase58(), borrowValue],
    () =>
      fetchBulkSuggestion({
        publicKey: walletPublicKey,
        totalValue: borrowValue,
      }),
    {
      enabled: !!walletPublicKey || !!borrowValue,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  return {
    bulkSuggestion: data || {},
    isLoading,
  };
};

export const useBorrowBulkSuggestionPage = () => {
  const history = useHistory();
  const wallet = useWallet();
  const { search } = useLocation();
  const borrowValue = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return parseFloat(searchParams.get('borrowValue') || '0');
  }, [search]);

  const { setCartState } = useBorrow();

  useEffect(() => {
    if (borrowValue === 0) {
      history.replace(PATHS.BORROW_ROOT);
    }
  }, [borrowValue, history]);

  const { bulkSuggestion, isLoading: bulkSuggestionLoading } =
    useBulkSuggestion({
      borrowValue,
      walletPublicKey: wallet.publicKey,
    });

  const isBulkExist = useMemo(() => !isEmpty(bulkSuggestion), [bulkSuggestion]);

  const onBackBtnClick = () => history.push(PATHS.BORROW_ROOT);

  const onBulkSuggestionSelect = (suggestion: Suggestion) => {
    const cartOrders: Order[] = suggestion?.orders.map((order) => ({
      borrowNft: order.borrowNft,
      loanType: order.loanType,
      loanValue: order.loanValue,
      bondOrderParams:
        order.loanType === LoanType.BOND
          ? {
              market: suggestion.markets.find(
                ({ marketPubkey }) =>
                  marketPubkey === order?.borrowNft?.bondParams?.marketPubkey,
              ),
              orderParams: order.bondOrderParams,
            }
          : null,
    }));

    setCartState({
      orders: cartOrders,
      pairs: suggestion?.modifiedPairs,
    });

    history.push(PATHS.BORROW_BULK_OVERVIEW);
  };

  return {
    borrowValue,
    suggestions: bulkSuggestion,
    loading: bulkSuggestionLoading,
    isBulkExist,
    isWalletConnected: wallet.connected,
    onBackBtnClick,
    onBulkSuggestionSelect,
  };
};
