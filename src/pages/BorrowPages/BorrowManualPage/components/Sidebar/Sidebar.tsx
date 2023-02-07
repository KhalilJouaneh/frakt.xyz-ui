import { FC } from 'react';

import SidebarLayout from '@frakt/components/Sidebar';
import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import NftsCarousel from '@frakt/components/Sidebar/components/Slider';
import { Loader } from '@frakt/components/Loader';

import styles from './Sidebar.module.scss';
import { BorrowForm } from '../BorrowForm';
import { useSidebar } from './hooks';

export const Sidebar: FC = () => {
  const {
    isLoading,
    isBulk,
    totalBorrowValue,
    currentNft,
    onRemoveNft,
    onNextNftSelect,
    minimizedOnMobile,
    setMinimizedOnMobile,
    onSubmit,
  } = useSidebar();

  return (
    <SidebarLayout
      setVisible={() => setMinimizedOnMobile((prev) => !prev)}
      contentVisible={!minimizedOnMobile}
      isSidebarVisible={true}
    >
      <CollapsedContent
        isVisible={!minimizedOnMobile}
        onClick={onSubmit}
        title={`${isBulk ? 'View bulk ' : 'Quick borrow '} loan ${(
          totalBorrowValue / 1e9
        ).toFixed(2)} SOL`}
      />
      <div className={styles.sidebar}>
        {isLoading && <Loader size="large" />}
        {!isLoading && !!currentNft && (
          <>
            <NftsCarousel
              nfts={currentNft}
              onDeselect={() => onRemoveNft(currentNft)}
              onPrev={() => onNextNftSelect(true)}
              onNext={() => onNextNftSelect()}
              isBulkLoan={isBulk}
            />
            <BorrowForm onSubmit={onSubmit} />
          </>
        )}
      </div>
    </SidebarLayout>
  );
};
