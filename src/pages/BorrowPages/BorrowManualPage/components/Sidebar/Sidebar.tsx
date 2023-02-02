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
    order,
    minimizedOnMobile,
    setMinimizedOnMobile,
    totalBorrowValue,
    isBulk,
    loading,
    onRemoveOrder,
    onNextOrder,
    goToBulkOverviewPage,
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
        onClick={goToBulkOverviewPage}
        title={`View ${isBulk ? 'bulk ' : ''} loan ${totalBorrowValue.toFixed(
          2,
        )} SOL`}
      />
      <div className={styles.sidebar}>
        {loading && <Loader size="large" />}
        {!loading && !!order && (
          <>
            <NftsCarousel
              nfts={order?.borrowNft}
              onDeselect={() => onRemoveOrder(order)}
              onPrev={() => onNextOrder(true)}
              onNext={() => onNextOrder()}
              isBulkLoan={isBulk}
            />
            <BorrowForm onSubmit={onSubmit} />
          </>
        )}
      </div>
    </SidebarLayout>
  );
};
