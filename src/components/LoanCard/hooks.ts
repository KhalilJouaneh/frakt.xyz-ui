import { claimGemFarm } from './../../utils/stake/claimGemFarm';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@frakt-protocol/frakt-sdk';
import { useDispatch } from 'react-redux';

import { usePartialRepayModal } from '../../pages/LiquidationsPage/components/PartialRepayModal';
import { paybackLoan as paybackLoanTx } from '../../utils/loans';
import { commonActions } from '../../state/common/actions';
import { loansActions } from '../../state/loans/actions';
import { useLoadingModal } from '../LoadingModal';
import { stakeGemFarm, unstakeGemFarm } from '../../utils/stake';
import { Loan } from '../../state/loans/types';
import { useConnection } from '../../hooks';
import {
  DEGODS_BANK_PUBKEY,
  DEGODS_FARM_PUBKEY,
} from '../../utils/stake/constants';

export enum RewardState {
  STAKED = 'staked',
  UNSTAKED = 'unstaked',
}

export const usePaybackLoan = (loan: Loan) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

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

  const onPartialPayback = async (paybackAmount: BN) => {
    try {
      openLoadingModal();
      closePartialRepayModal();

      if (loan?.reward?.stakeState === RewardState.STAKED) {
        await onGemUnstake();
      }

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
      closeLoadingModal();
    }
  };

  const onGemUnstake = async (): Promise<void> => {
    try {
      const { pubkey, mint, reward } = loan;

      openLoadingModal();

      const result = await unstakeGemFarm({
        connection,
        wallet,
        gemFarm: DEGODS_FARM_PUBKEY,
        gemBank: DEGODS_BANK_PUBKEY,
        farm: reward.farm,
        bank: reward.bank,
        nftMint: mint,
        loan: pubkey,
        isDegod: true,
      });

      if (!result) {
        throw new Error('Unstake failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const onPayback = async () => {
    try {
      const { isPriceBased, isGracePeriod, reward } = loan;

      openLoadingModal();

      if (isPriceBased && !isGracePeriod) {
        openPartialRepayModal();
        return;
      }

      if (reward?.stakeState === RewardState.STAKED) {
        await onGemUnstake();
      }

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
      closeLoadingModal();
    }
  };

  const onGemStake = async (): Promise<void> => {
    try {
      const { pubkey, mint, reward } = loan;

      openLoadingModal();

      const result = await stakeGemFarm({
        connection,
        wallet,
        gemFarm: DEGODS_FARM_PUBKEY,
        gemBank: DEGODS_BANK_PUBKEY,
        farm: reward?.farm,
        bank: reward?.bank,
        nftMint: mint,
        loan: pubkey,
        isDegod: true,
        creatorWhitelistProof: reward?.creatorWhitelistProof,
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

  const onGemClaim = async (): Promise<void> => {
    try {
      const { pubkey, mint, reward } = loan;

      openLoadingModal();

      const result = await claimGemFarm({
        connection,
        wallet,
        gemFarm: DEGODS_FARM_PUBKEY,
        gemBank: DEGODS_BANK_PUBKEY,
        farm: reward?.farm,
        bank: reward?.bank,
        nftMint: mint,
        loan: pubkey,
        isDegod: true,
        rewardAMint: reward?.rewardAMint,
        rewardBMint: reward?.rewardBMint,
        creatorWhitelistProof: reward?.creatorWhitelistProof,
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
    onGemClaim,
    onGemStake,
    closeLoadingModal,
    loadingModalVisible,
  };
};
