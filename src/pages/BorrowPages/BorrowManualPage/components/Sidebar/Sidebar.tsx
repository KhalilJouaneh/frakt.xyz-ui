import { FC } from 'react';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';
import { Loader } from '@frakt/components/Loader';

import { BorrowForm } from '../BorrowForm';
import { useSidebar } from './hooks';
import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const {
    nft,
    market,
    pairs,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
    totalBorrowValue,
    isBulk,
    loading,
    removeNftFromSelection,
    hightlightNextNftInSelection,
    updateNftInSelection,
    goToBulkOverviewPage,
  } = useSidebar();

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
        {loading && <Loader size="large" />}
        {!loading && (
          <>
            <NftsCarousel
              nfts={nft}
              onDeselect={() => removeNftFromSelection(nft.borrowNft.mint)}
              onPrev={() => hightlightNextNftInSelection(true)}
              onNext={() => hightlightNextNftInSelection()}
              isBulkLoan={isBulk}
            />
            <BorrowForm
              nft={nft}
              updateNftInSelection={updateNftInSelection}
              totalBorrowValue={totalBorrowValue}
              isBulk={isBulk}
              onSubmit={onSubmit}
              market={market}
              pairs={pairs}
            />
          </>
        )}
      </div>
    </SidebarLayout>
  );
};
