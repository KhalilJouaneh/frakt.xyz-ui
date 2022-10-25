import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { commonActions } from '../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import { Tab } from '../../../../components/Tabs';
import { BorrowNft } from '../../../../state/loans/types';
import { proposeLoan } from '../../../../utils/loans';
import { useConnection } from '../../../../hooks';
import { BulkValues } from '../../hooks';
import { useSelect } from '../../../../componentsNew/Select/hooks';
import { useLoanFields } from '../LoanFields/hooks';
import { selectCurrentLoanNft } from '../../../../state/loans/selectors';

const getConfirmModalText = (nft: BorrowNft, isPriceBased = false) => {
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
  priceBasedDisabled: boolean;
  selectValue: string;
  setSelectValue: (value: string) => void;
  updateCurrentNft: () => void;
  solLoanValue: number;
  setSolLoanValue: (value: number) => void;
  sliderValue: number;
};

export const useBorrowForm: UseBorrowForm = ({ onDeselect, selectedNft }) => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const connection = useConnection();

  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;
  const isPriceBased = selectedNft?.isPriceBased;

  const { loanTypeOptions, averageLoanValue, maxLoanValueNumber } =
    useLoanFields(selectedNft);

  const {
    options: selectOptions,
    value: selectValue,
    setValue: setSelectValue,
  } = useSelect({
    options: loanTypeOptions,
    defaultValue: loanTypeOptions[!isPriceBased ? 0 : 1].value,
  });

  const [solLoanValue, setSolLoanValue] = useState<number>(0);
  const isPriceBasedType = selectValue === 'perpetual';

  const defaultSliderValue =
    (selectedNft as any)?.solLoanValue || averageLoanValue;
  const sliderValue = isPriceBasedType ? solLoanValue : maxLoanValueNumber;

  const updateCurrentNft = () => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: selectedNft?.mint,
          solLoanValue: selectedNft?.solLoanValue,
          type: selectValue,
        }),
      );
    }
  };

  useEffect(() => {
    if (defaultSliderValue) {
      setSolLoanValue(defaultSliderValue || 0);
    } else {
      setSolLoanValue(sliderValue);
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
    const { mint, timeBased, valuation } = nft;

    const timeBasedLtv = timeBased.ltvPercents;
    const valuationNumber = parseFloat(valuation);

    const priceBasedLTV = currentLoanNft.ltv;

    const loanToValue =
      currentLoanNft.type === 'perpetual' ? priceBasedLTV : timeBasedLtv;

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
    sliderValue,
    priceBasedDisabled: !selectedNft?.priceBased,
  };
};
