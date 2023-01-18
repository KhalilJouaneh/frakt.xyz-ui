import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sum } from 'ramda';
import cx from 'classnames';

import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import Slider from '@frakt/components/Sidebar/components/Slider';
import { BorrowNftSelected } from '@frakt/pages/BorrowPages/selectedNftsState';
import { selectSelectedNftId } from '@frakt/state/common/selectors';
import { selectCurrentLoanNft } from '@frakt/state/loans/selectors';
import { commonActions } from '@frakt/state/common/actions';
import { loansActions } from '@frakt/state/loans/actions';
import { BorrowNft } from '@frakt/api/nft';
import SidebarLayout from '@frakt/components/Sidebar';
import styles from './SidebarForm.module.scss';
import BorrowForm from '../BorrowForm';

export interface SidebarFormProps {
  onDeselect?: (nft?: BorrowNft) => void;
  nfts: BorrowNft[];
  isCloseSidebar: boolean;
  bulkNfts: BorrowNftSelected[];
  onOpenBulk: () => void;
}

const SidebarForm: FC<SidebarFormProps> = ({
  onDeselect,
  nfts,
  bulkNfts,
  onOpenBulk,
}) => {
  const isSidebarVisible = !!nfts.length;
  const totalNftsId = nfts.length - 1;
  const isBulkLoan = nfts.length > 1;

  const dispatch = useDispatch();

  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;

  const currentNftId = useSelector(selectSelectedNftId);

  const id = currentNftId > totalNftsId ? 0 : currentNftId;

  const [visible, setVisible] = useState<boolean>(false);

  const selectedNft = bulkNfts?.[id];

  const totalBorrowed = sum(
    bulkNfts.map((nft) => {
      if (nft.mint === currentLoanNft.mint) {
        return currentLoanNft.solLoanValue;
      } else {
        return nft?.solLoanValue;
      }
    }),
  );

  const updateCurrentNft = (selectedNft) => {
    if (selectedNft?.priceBased) {
      dispatch(
        loansActions.updatePerpLoanNft({
          mint: currentLoanNft.mint,
          solLoanValue: currentLoanNft.solLoanValue,
          ltv: currentLoanNft.ltv,
          type: currentLoanNft.type,
        }),
      );
    }
  };

  const onNextNft = (idx: number): void => {
    updateCurrentNft(selectedNft);
    if (idx > totalNftsId) {
      dispatch(commonActions.setSelectedNftId(0));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  const onPrevNft = (idx: number): void => {
    updateCurrentNft(selectedNft);

    if (idx < 0) {
      dispatch(commonActions.setSelectedNftId(totalNftsId));
    } else {
      dispatch(commonActions.setSelectedNftId(idx));
    }
  };

  return (
    <>
      {isSidebarVisible && (
        <SidebarLayout
          setVisible={() => setVisible(!visible)}
          contentVisible={visible}
          isSidebarVisible={isSidebarVisible}
        >
          <CollapsedContent
            isVisible={visible}
            onClick={onOpenBulk}
            title={`View bulk loan ${totalBorrowed.toFixed(2)} SOL`}
          />
          <div className={cx(styles.sidebar, visible && styles.sidebarHidden)}>
            <Slider
              nfts={selectedNft}
              onDeselect={onDeselect}
              onPrev={() => onPrevNft(currentNftId - 1)}
              onNext={() => onNextNft(currentNftId + 1)}
              isBulkLoan={isBulkLoan}
            />
            <BorrowForm
              onClick={onOpenBulk}
              selectedNft={selectedNft}
              isBulkLoan={isBulkLoan}
              onDeselect={onDeselect}
              totalBorrowed={totalBorrowed}
            />
          </div>
        </SidebarLayout>
      )}
    </>
  );
};

export default SidebarForm;
