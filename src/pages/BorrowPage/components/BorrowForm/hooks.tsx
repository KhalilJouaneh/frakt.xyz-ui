import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowNft } from '@frakt/api/nft';

import { selectCurrentLoanNft } from '../../../../state/loans/selectors';
import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { commonActions } from '../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import { useSelect } from '../../../../components/Select/hooks';
import { proposeLoan } from '../../../../utils/loans';
import { useLoanFields } from '../LoanFields/hooks';
import { useConnection } from '../../../../hooks';
import { Tab } from '../../../../components/Tabs';
import { BulkValues } from '../../hooks';

const getConfirmModalText = (nft: BorrowNft, isPriceBased = false): string => {
  const { name, timeBased } = nft;

  const confirmShortTermText = `You are about to use ${name} as collateral for an instant loan of ${timeBased.repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${timeBased.returnPeriodDays} days. Proceed?`;
  const confirmLongTermText = `You are about to confirm the transaction to borrow against your ${name}`;

  return isPriceBased ? confirmLongTermText : confirmShortTermText;
};

type UseBorrowForm = (props: {
  onDeselect?: () => void;
  selectedNft?: BulkValues;
}) => {
  selectOptions: Tab[];
  openConfirmModal: () => void;
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  onSubmit: (nft: BorrowNft) => void;
  confirmText: string;
  selectValue: string;
  setSelectValue: (value: string) => void;
  setSolLoanValue: (value: number) => void;
  updateCurrentNft: () => void;
  solLoanValue: number;
};

export const useBorrowForm: UseBorrowForm = ({ onDeselect, selectedNft }) => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const connection = useConnection();

  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;
  const isPriceBased = selectedNft?.isPriceBased;

  const { loanTypeOptions, averageLoanValue } = useLoanFields(selectedNft);

  const {
    options: selectOptions,
    value: selectValue,
    setValue: setSelectValue,
  } = useSelect({
    options: loanTypeOptions,
    defaultValue: loanTypeOptions[!isPriceBased ? 0 : 1].value,
  });

  const [loanValue, setSolLoanValue] = useState<number>(0);
  const defaultSliderValue = selectedNft?.solLoanValue || averageLoanValue;

  const priceBasedLtv = selectedNft?.priceBased?.ltvPercents / 100;
  const valuationNumber = parseFloat(selectedNft.valuation);

  const priceBasedLoanValue = valuationNumber * priceBasedLtv;

  const solLoanValue = useMemo(() => {
    if (currentLoanNft.type !== 'flip') {
      return loanValue > priceBasedLoanValue ? priceBasedLoanValue : loanValue;
    } else {
      return loanValue;
    }
  }, [loanValue, currentLoanNft]);

  const updateParams = {
    solLoanValue,
    type: selectValue,
  };

  const updateCurrentNft = () => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: selectedNft?.mint,
          ...updateParams,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(
      loansActions.setCurrentLoanNft({
        ...selectedNft,
        ...updateParams,
      }),
    );
  }, [solLoanValue, selectValue, selectedNft]);

  useEffect(() => {
    if (defaultSliderValue) {
      setSolLoanValue(defaultSliderValue || 0);
    }
  }, [selectedNft]);

  useEffect(() => {
    if (isPriceBased) {
      setSelectValue('perpetual');
    } else {
      setSelectValue('flip');
    }
  }, [selectedNft]);

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const removeTokenOptimistic = (mint: string): void => {
    dispatch(loansActions.addHiddenBorrowNftMint(mint));
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onSubmit = async (nft: BorrowNft) => {
    const { mint, valuation } = nft;

    const valuationNumber = parseFloat(valuation);

    const loanToValue = (currentLoanNft.solLoanValue / valuationNumber) * 100;

    const isPriceBased = currentLoanNft.type === 'perpetual';

    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await proposeLoan({
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

  const confirmText = getConfirmModalText(selectedNft, isPriceBased);

  return {
    selectOptions,
    selectValue,
    setSelectValue,
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    confirmText,
    updateCurrentNft,
    solLoanValue,
    setSolLoanValue,
  };
};
