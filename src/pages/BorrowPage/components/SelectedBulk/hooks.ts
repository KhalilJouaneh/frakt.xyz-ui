import { loansActions } from './../../../../state/loans/actions';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { sum, map } from 'ramda';

import { useLoadingModal } from '../../../../components/LoadingModal';
import { commonActions } from '../../../../state/common/actions';
import { proposeBulkLoan } from '../../../../utils/loans';
import { useConnection } from '../../../../hooks';

type UseSeletedBulk = (props: { rawselectedBulk: any }) => {
  onCardClick: (id: number) => void;
  onSubmit: () => Promise<void>;
  closeLoadingModal: () => void;
  loadingModalVisible: boolean;
  selectedBulkValue: number;
  activeCardId: number;
  selectedBulk: any;
  feeOnDay: number;
};

export const useSeletedBulk: UseSeletedBulk = ({ rawselectedBulk }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const [selectedBulk, setSelectedBulk] = useState(rawselectedBulk);

  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  const feeOnDay = sum(
    rawselectedBulk.map((nft): number => {
      if (!nft.isPriceBased) {
        const { timeBased } = nft;

        return Number(timeBased?.fee) / timeBased?.returnPeriodDays;
      } else {
        const { priceBased, valuation } = nft;

        const ltv = priceBased?.ltv || priceBased?.ltvPercents;

        const loanValue = parseFloat(valuation) * (ltv / 100);

        return (loanValue * (priceBased.borrowAPRPercents * 0.01)) / 365;
      }
    }),
  );

  console.log(rawselectedBulk);

  const selectedBulkValue = sum(map(maxLoanValue, selectedBulk));

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const onCardClick = (id: number): void => {
    if (id === activeCardId) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
    }
  };

  useEffect(() => {
    dispatch(loansActions.setBulkNfts(rawselectedBulk));
  }, [dispatch]);

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onSubmit = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await proposeBulkLoan({
        wallet,
        connection,
        selectedBulk,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      showConfetti();
      setSelectedBulk([]);
    } catch (e) {
      console.error(e);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    selectedBulk,
    selectedBulkValue,
    onSubmit,
    onCardClick,
    loadingModalVisible,
    activeCardId,
    closeLoadingModal,
    feeOnDay,
  };
};
