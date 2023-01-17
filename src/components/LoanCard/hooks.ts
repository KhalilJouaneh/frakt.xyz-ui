import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@frakt-protocol/frakt-sdk';
import { useDispatch } from 'react-redux';

import { usePartialRepayModal } from '../PartialRepayModal';
import { paybackLoan as paybackLoanTx } from '../../utils/loans';
import { commonActions } from '../../state/common/actions';
import { loansActions } from '../../state/loans/actions';
import { useLoadingModal } from '../LoadingModal';
import {
  stakeCardinal,
  unstakeCardinal,
  claimCardinal,
} from '../../utils/stake';
import { Loan } from '../../state/loans/types';
import { useConnection } from '../../hooks';

export enum RewardState {
  STAKED = 'staked',
  UNSTAKED = 'unstaked',
}

export const useLoans = (loan: Loan) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const isStaked = loan?.reward?.stakeState === RewardState.STAKED;

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const {
    visible: partialRepayModalVisible,
    open: openPartialRepayModal,
    close: closePartialRepayModal,
  } = usePartialRepayModal();

  const removeTokenOptimistic = (mint: string) => {
    dispatch(loansActions.addHiddenLoanNftMint(mint));
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onPartialPayback = async (
    paybackAmount: BN,
    partialPercent: number,
  ) => {
    try {
      closePartialRepayModal();

      const isFullPayback = partialPercent === 100;

      if (isStaked && isFullPayback) {
        await onCardinalUnstake();
      }

      setTransactionsLeft(null);
      openLoadingModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
        paybackAmount,
      });

      if (!result) {
        throw new Error('Payback failed');
      }

      showConfetti();
    } catch (error) {
      console.error(error);
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onCardinalUnstake = async (): Promise<boolean> => {
    try {
      const { pubkey, mint } = loan;

      setTransactionsLeft(2);
      openLoadingModal();

      const result = await claimCardinal({
        connection,
        wallet,
        nftMint: mint,
        loan: pubkey,
      });

      if (!result) {
        throw new Error('Unstake failed');
      }

      setTransactionsLeft(1);

      await unstakeCardinal({
        connection,
        wallet,
        nftMint: mint,
        loan: pubkey,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onPayback = async () => {
    try {
      const { isPriceBased, isGracePeriod } = loan;

      if (isPriceBased && !isGracePeriod) {
        openPartialRepayModal();
        return;
      }

      if (isStaked) {
        await onCardinalUnstake();
      }

      openLoadingModal();

      const result = await paybackLoanTx({
        connection,
        wallet,
        loan,
      });

      if (!result) {
        throw new Error('Payback failed');
      }

      showConfetti();
      removeTokenOptimistic(loan.mint);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setTransactionsLeft(null);
      closeLoadingModal();
    }
  };

  const onCardinalStake = async (): Promise<void> => {
    try {
      const { pubkey, mint } = loan;

      openLoadingModal();

      const result = await stakeCardinal({
        connection,
        wallet,
        nftMint: mint,
        loan: pubkey,
      });

      if (!result) {
        throw new Error('Staking failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const onCardinalClaim = async (): Promise<void> => {
    try {
      const { pubkey, mint } = loan;

      openLoadingModal();

      const result = await claimCardinal({
        connection,
        wallet,
        nftMint: mint,
        loan: pubkey,
      });

      if (!result) {
        throw new Error('Claim failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    onPartialPayback,
    closePartialRepayModal,
    partialRepayModalVisible,
    onPayback,
    onCardinalClaim,
    onCardinalStake,
    onCardinalUnstake,
    closeLoadingModal,
    loadingModalVisible,
    transactionsLeft,
  };
};
