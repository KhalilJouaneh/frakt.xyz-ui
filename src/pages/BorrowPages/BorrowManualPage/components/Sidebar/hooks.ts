import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sum } from 'lodash';
import { useHistory } from 'react-router-dom';

import { PATHS } from '@frakt/constants';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import {
  makeCreateBondTransactions,
  useMarket,
  useMarketPairs,
} from '@frakt/utils/bonds';
import { LoanType } from '@frakt/api/loans';
import { useConnection } from '@frakt/hooks';

import { useSelectedNfts } from '../../../selectedNftsState';

export const useSidebar = () => {
  const {
    selection,
    highlightedNftMint,
    hightlightNextNftInSelection,
    removeNftFromSelection,
    findNftInSelection,
    updateNftInSelection,
  } = useSelectedNfts();

  const nft = findNftInSelection(highlightedNftMint);

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);

  const totalBorrowValue = useMemo(() => {
    return sum(selection.map(({ loanValue }) => loanValue));
  }, [selection]);

  const isBulk = selection.length > 1;

  const { market, isLoading: isLoadingMarket } = useMarket({
    marketPubkey: nft?.borrowNft?.bondParams?.marketPubkey,
  });

  const { pairs, isLoading: isLoadingMarketPair } = useMarketPairs({
    marketPubkey: nft?.borrowNft?.bondParams?.marketPubkey,
  });

  const loading =
    nft?.borrowNft?.bondParams?.marketPubkey &&
    (isLoadingMarket || isLoadingMarketPair);

  const connection = useConnection();
  const wallet = useWallet();

  const onSubmit = async () => {
    try {
      if (isBulk) {
        return goToBulkOverviewPage();
      }

      if (selection[0] && selection[0].loanType === LoanType.BOND) {
        const nft = selection[0];
        const { bondAccounts, loanValue } = nft;
        const { transaction, signers } = await makeCreateBondTransactions({
          nftMint: nft.borrowNft.mint,
          market: bondAccounts.market,
          pair: bondAccounts.pair,
          borrowValue: loanValue,
          connection,
          wallet,
        });

        await signAndConfirmTransaction({
          connection,
          transaction,
          signers,
          wallet,
        });
      }
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-console
      console.warn(error.logs?.join('\n'));
    }
  };

  return {
    nft,
    market,
    pairs,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    totalBorrowValue,
    isBulk,
    loading,
    removeNftFromSelection,
    hightlightNextNftInSelection,
    updateNftInSelection,
    goToBulkOverviewPage,
  };
};
