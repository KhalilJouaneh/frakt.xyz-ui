import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowNft } from '@frakt-protocol/frakt-sdk';

import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { selectCurrentLoanNft } from '@frakt/state/loans/selectors';
import { proposeLoan as proposeLoanTxn } from '@frakt/utils/loans';
import { useConfirmModal } from '@frakt/components/ConfirmModal';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { makeCreateBondTransactions } from '@frakt/utils/bonds';
import { commonActions } from '@frakt/state/common/actions';
import { loansActions } from '@frakt/state/loans/actions';
import { useConnection } from '@frakt/hooks';
import { Market, Pair } from '@frakt/api/bonds';

export const useLoanTxns = ({ onDeselect }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;
  const dispatch = useDispatch();

  const { close: closeConfirmModal } = useConfirmModal();
  const { close: closeLoadingModal, open: openLoadingModal } =
    useLoadingModal();

  const removeTokenOptimistic = (mint: string): void => {
    dispatch(loansActions.addHiddenBorrowNftMint(mint));
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const proposeBondLoan = async ({
    nft,
    market,
    pairs,
    borrowValue,
  }: {
    nft: BorrowNft;
    market: Market;
    pairs: Pair[];
    borrowValue: number;
  }) => {
    try {
      closeConfirmModal();
      openLoadingModal();

      const txn = await makeCreateBondTransactions({
        market,
        pair: pairs[0],
        nftMint: nft.mint,
        borrowValue,
        connection,
        wallet,
      });

      await signAndConfirmTransaction({
        transaction: txn.createBondTxn.transaction,
        signers: txn.createBondTxn.signers,
        connection,
        wallet,
      });

      await signAndConfirmTransaction({
        transaction: txn.validateAndSellTxn.transaction,
        signers: txn.validateAndSellTxn.signers,
        connection,
        wallet,
      });

      if (!txn) {
        throw new Error('Loan proposing failed');
      }

      removeTokenOptimistic(nft.mint);
      onDeselect?.();
    } catch (error) {
      console.error(error);
    } finally {
      closeConfirmModal();
      closeLoadingModal();
    }
  };

  const proposeLoan = async (nft: BorrowNft) => {
    const { mint, valuation } = nft;

    const valuationNumber = parseFloat(valuation);

    const loanToValue = (currentLoanNft.solLoanValue / valuationNumber) * 100;

    const isPriceBased = currentLoanNft.type === 'perpetual';

    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await proposeLoanTxn({
        nftMint: mint,
        connection,
        wallet,
        valuation: valuationNumber,
        isPriceBased,
        onApprove: showConfetti,
        loanToValue,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      removeTokenOptimistic(mint);
      onDeselect?.();
    } catch (error) {
      console.error(error);
    } finally {
      closeConfirmModal();
      closeLoadingModal();
    }
  };

  return {
    proposeBondLoan,
    proposeLoan,
  };
};
