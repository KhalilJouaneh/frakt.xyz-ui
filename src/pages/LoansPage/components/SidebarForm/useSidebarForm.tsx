import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { map, sum } from 'ramda';

import { paybackLoans } from './../../../../utils/loans/paybackLoans';
import { commonActions } from './../../../../state/common/actions';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { loansActions } from '@frakt/state/loans/actions';
import { useSelectableNftsState } from '../../hooks';
import { Loan } from '@frakt/state/loans/types';
import { useConnection } from '@frakt/hooks';

type useSidebarForm = () => {
  onSubmit: () => Promise<void>;
  closeLoadingModal: boolean;
  loadingModalVisible: boolean;
  onNextNft: () => void;
  onPrevNft: () => void;
};

export const useSidebarForm = () => {
  const wallet = useWallet();
  const connection = useConnection();

  const dispatch = useDispatch();

  const removeTokenOptimistic = (mint: string): void => {
    dispatch(loansActions.addHiddenLoanNftMint(mint));
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const {
    currentSelectedId,
    selectedNfts,
    setSelectedNfts,
    setCurrentSelectedId,
  } = useSelectableNftsState();

  const totalNfts = selectedNfts.length - 1;
  const currentNftId = currentSelectedId > totalNfts ? 0 : currentSelectedId;
  const currentNft = selectedNfts[currentNftId];

  const repayValue = (nft: Loan) => nft?.repayValue;
  const totalPayback = sum(map(repayValue, selectedNfts));

  const onNextNft = (idx: number): void => {
    if (idx > totalNfts) {
      setCurrentSelectedId(0);
    } else {
      setCurrentSelectedId(idx);
    }
  };

  const onPrevNft = (idx: number): void => {
    if (idx < 0) {
      setCurrentSelectedId(totalNfts);
    } else {
      setCurrentSelectedId(idx);
    }
  };

  const onSubmit = async (): Promise<void> => {
    try {
      await openLoadingModal();

      const result = await paybackLoans({
        connection,
        wallet,
        loans: selectedNfts,
      });

      if (result) {
        selectedNfts.map(({ mint }) => {
          removeTokenOptimistic(mint);
        });

        setSelectedNfts([]);
        showConfetti();
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };
  return {
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    onNextNft,
    onPrevNft,
    currentNft,
    totalPayback,
  };
};
