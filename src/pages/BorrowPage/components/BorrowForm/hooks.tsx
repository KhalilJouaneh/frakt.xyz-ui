import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowNft } from '@frakt/api/nft';

import { selectCurrentLoanNft } from '../../../../state/loans/selectors';
import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { loansActions } from '../../../../state/loans/actions';
import { useSelect } from '../../../../components/Select/hooks';
import { useLoanFields } from '../LoanFields/hooks';
import { Tab } from '../../../../components/Tabs';
import { BorrowNftSelected } from '@frakt/pages/BorrowPages/selectedNftsState';

const getConfirmModalText = (
  nft: BorrowNft,
  solLoanValue,
  selectValue = 'flip',
): string => {
  const { name, timeBased } = nft;
  const isFlip = selectValue === 'flip';

  const confirmShortTermText = `You are about to use ${name} as collateral for an instant loan of ${
    solLoanValue?.toFixed(2) || 0
  } SOL (incl. interest rate if applicable) that you commit to repay in full within ${
    timeBased.returnPeriodDays
  } days. Proceed?`;
  const confirmLongTermText = `You are about to confirm the transaction to borrow against your ${name}`;

  return isFlip ? confirmShortTermText : confirmLongTermText;
};

type UseBorrowForm = (props: { selectedNft?: BorrowNftSelected }) => {
  selectOptions: Tab[];
  openConfirmModal: () => void;
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  confirmText: string;
  selectValue: string;
  setSelectValue: (value: string) => void;
  setSolLoanValue: (value: number) => void;
  updateCurrentNft: () => void;
  solLoanValue: number;
};

export const useBorrowForm: UseBorrowForm = ({ selectedNft }) => {
  const dispatch = useDispatch();

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

  const { visible: loadingModalVisible, close: closeLoadingModal } =
    useLoadingModal();

  const confirmText = getConfirmModalText(
    selectedNft,
    solLoanValue,
    selectValue,
  );

  return {
    selectOptions,
    selectValue,
    setSelectValue,
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    confirmText,
    updateCurrentNft,
    solLoanValue,
    setSolLoanValue,
  };
};
