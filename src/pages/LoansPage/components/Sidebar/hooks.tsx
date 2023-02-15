import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { map, sum } from 'lodash';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import { useConnection } from '@frakt/hooks';
import { Loan } from '@frakt/api/loans';

import { paybackLoans } from '../../../../utils/loans/paybackLoans';
import { commonActions } from '../../../../state/common/actions';
import { useHiddenLoansPubkeys, useSelectedLoans } from '../../loansState';

export const useSidebar = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const {
    selection,
    clearSelection,
    findLoanInSelection,
    removeLoanFromSelection,
  } = useSelectedLoans();
  const { addHiddenLoansPubkeys } = useHiddenLoansPubkeys();

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>();

  useEffect(() => {
    if (selection.length) {
      setSelectedLoan(selection.at(-1) ?? null);
    } else {
      setSelectedLoan(null);
    }
  }, [selection]);

  const selectNextLoan = (reverse = false) => {
    const currenHighlightedLoanIdx =
      selection.findIndex(({ pubkey }) => selectedLoan.pubkey === pubkey) ?? 0;

    const shift = !reverse ? 1 : -1;

    const nextSelectedLoan =
      selection.at(currenHighlightedLoanIdx + shift) ?? selection.at(0);

    setSelectedLoan(nextSelectedLoan);
  };

  const showConfetti = () => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onSubmit = async () => {
    try {
      openLoadingModal();

      const result = await paybackLoans({
        connection,
        wallet,
        loans: selection,
      });

      if (result) {
        addHiddenLoansPubkeys(...selection.map(({ pubkey }) => pubkey));

        clearSelection();
        showConfetti();
      }
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-console
      console.warn(error?.logs?.join('\n'));
    } finally {
      closeLoadingModal();
    }
  };

  return {
    selection,
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    selectedLoan: findLoanInSelection(selectedLoan?.pubkey),
    selectNextLoan,
    onDeselectLoan: () => removeLoanFromSelection(selectedLoan?.pubkey),
    totalDebt: sum(map(selection, ({ repayValue }) => repayValue / 1e9)),
  };
};
