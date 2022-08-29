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

  const onPayback = async () => {
    try {
      const { isPriceBased, isGracePeriod, reward } = loan;

      if (isPriceBased && !isGracePeriod) {
        openPartialRepayModal();
        return;
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

      if (reward?.stakeType === RewardState.STAKED) {
        onUnstakeClaim();
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
        farm: reward?.dataA,
        bank: reward?.dataB,
        nftMint: mint,
        loan: pubkey,
        isDegod: true,
        creatorWhitelistProof: reward?.creatorWhiteListProof,
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
        farm: reward?.dataA,
        bank: reward?.dataB,
        nftMint: mint,
        loan: pubkey,
        isDegod: true,
        rewardAMint: reward?.dataC,
        rewardBMint: reward?.dataD,
        creatorWhitelistProof: reward?.creatorWhiteListProof,
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

  const onUnstakeClaim = async (): Promise<void> => {
    try {
      const { pubkey, mint, reward } = loan;

      openLoadingModal();

      const result = await unstakeGemFarm({
        connection,
        wallet,
        gemFarm: DEGODS_FARM_PUBKEY,
        gemBank: DEGODS_BANK_PUBKEY,
        farm: reward.dataA,
        bank: reward.dataB,
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

  return {
    onPartialPayback,
    closePartialRepayModal,
    partialRepayModalVisible,
    onPayback,
    onGemClaim,
    onGemStake,
    onUnstakeClaim,
    closeLoadingModal,
    loadingModalVisible,
  };
};
