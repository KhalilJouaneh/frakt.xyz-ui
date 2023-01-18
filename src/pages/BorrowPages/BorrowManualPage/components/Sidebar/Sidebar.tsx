import { FC, useMemo, useState } from 'react';
import { sum } from 'lodash';
import { useHistory } from 'react-router-dom';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import { PATHS } from '@frakt/constants';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';

import { useSelectedNfts } from '../../../selectedNftsState';
import { BorrowForm } from '../BorrowForm';
import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const {
    selection,
    highlightedNftMint,
    hightlightNextNftInSelection,
    removeNftFromSelection,
    findNftInSelection,
    updateNftInSelection,
  } = useSelectedNfts();

  const nft = findNftInSelection(highlightedNftMint);

  const [minimizedOnMobile, setMinimizedOnMobile] = useState<boolean>(false);

  const history = useHistory();
  const goToBulkOverviewPage = () => history.push(PATHS.BORROW_BULK_OVERVIEW);

  const totalBorrowValue = useMemo(() => {
    return sum(selection.map(({ solLoanValue }) => solLoanValue));
  }, [selection]);

  const isBulk = selection.length > 1;

  return (
    <SidebarLayout
      setVisible={() => setMinimizedOnMobile((prev) => !prev)}
      contentVisible={!minimizedOnMobile}
      isSidebarVisible={true}
    >
      <CollapsedContent
        isVisible={!minimizedOnMobile}
        onClick={goToBulkOverviewPage}
        title={`View ${isBulk ? 'bulk ' : ''} loan ${totalBorrowValue.toFixed(
          2,
        )} SOL`}
      />
      <div className={styles.sidebar}>
        <NftsCarousel
          nfts={nft}
          onDeselect={() => removeNftFromSelection(nft.mint)}
          onPrev={() => hightlightNextNftInSelection(true)}
          onNext={() => hightlightNextNftInSelection()}
          isBulkLoan={isBulk}
        />
        <BorrowForm
          nft={nft}
          updateNftInSelection={updateNftInSelection}
          totalBorrowValue={totalBorrowValue}
          isBulk={isBulk}
          onSubmit={goToBulkOverviewPage}
        />
      </div>
    </SidebarLayout>
  );
};
