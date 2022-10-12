import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { commonActions } from '../../../../state/common/actions';
import { loansActions } from '../../../../state/loans/actions';
import { Tab, useTabs } from '../../../../components/Tabs';
import { BorrowNft } from '../../../../state/loans/types';
import { proposeLoan } from '../../../../utils/loans';
import { useConnection } from '../../../../hooks';
import { BulkValues } from '../../hooks';

export enum FormFieldTypes {
  SHORT_TERM_FIELD = 'shortTermField',
  LONG_TERM_FIELD = 'longTermField',
}

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
  borrowTabs: Tab[];
  openConfirmModal: () => void;
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  onSubmit: (nft: BorrowNft) => void;
  formField: FormFieldTypes;
  setFormField: (nextFormField: FormFieldTypes) => void;
  priceBasedLTV: number;
  setPriceBasedLTV: (nextValue: number) => void;
  confirmText: string;
  priceBasedDisabled: boolean;
  tabValue: string;
  setTabValue: (value: string) => void;
  updateCurrentNft: any;
};

export const useBorrowForm: UseBorrowForm = ({ onDeselect, selectedNft }) => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const connection = useConnection();

  const isPriceBased = selectedNft?.isPriceBased;

  const defaultSliderValue = selectedNft.priceBased?.ltv;

  const [formField, setFormField] = useState<FormFieldTypes>(
    FormFieldTypes.LONG_TERM_FIELD,
  );

  const [priceBasedLTV, setPriceBasedLTV] =
    useState<number>(defaultSliderValue);

  const BORROW_FORM_TABS: Tab[] = [
    {
      label: 'Perpetual',
      value: 'perpetual',
      disabled: !selectedNft?.priceBased,
    },
    {
      label: 'Flip',
      value: 'flip',
    },
  ];

  const {
    tabs: borrowTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: BORROW_FORM_TABS,
    defaultValue: BORROW_FORM_TABS[1].value,
  });

  const updateCurrentNft = () => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: selectedNft?.mint,
          ltv: priceBasedLTV,
          formType: tabValue,
        }),
      );
    }
  };

  useEffect(() => {
    if (isPriceBased) {
      setTabValue('perpetual');
    } else {
      setTabValue('flip');
    }
  }, [selectedNft]);

  useEffect(() => {
    if (isPriceBased) {
      setFormField(FormFieldTypes.LONG_TERM_FIELD);
      setPriceBasedLTV(defaultSliderValue);
    } else {
      setFormField(FormFieldTypes.SHORT_TERM_FIELD);
      setPriceBasedLTV(25);
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
    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await proposeLoan({
        nftMint: nft?.mint,
        connection,
        wallet,
        valuation: parseFloat(nft?.valuation),
        isPriceBased: formField === FormFieldTypes.LONG_TERM_FIELD,
        onApprove: showConfetti,
        loanToValue:
          formField === FormFieldTypes.LONG_TERM_FIELD
            ? priceBasedLTV
            : nft.timeBased.ltvPercents,
      });

      if (!result) {
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

  const confirmText = getConfirmModalText(
    selectedNft,
    formField === FormFieldTypes.LONG_TERM_FIELD,
  );

  return {
    borrowTabs,
    tabValue,
    setTabValue,
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    formField,
    setFormField,
    priceBasedLTV,
    setPriceBasedLTV,
    confirmText,
    updateCurrentNft,
    priceBasedDisabled: !selectedNft?.priceBased,
  };
};
