import { FC } from 'react';
import classNames from 'classnames';

import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
import { useSidebarVisible } from '@frakt/components/Sidebar/hooks';
import Slider from '@frakt/components/Sidebar/components/Slider';
import { LoadingModal } from '@frakt/components/LoadingModal';
import SidebarLayout from '@frakt/components/Sidebar';
import { useSidebar } from './hooks';
import styles from './Sidebar.module.scss';
import RepayForm from '../RepayForm';

export const Sidebar: FC = () => {
  const { visible: sidebarVisible, toggle: toggleSidebar } =
    useSidebarVisible();

  const {
    selection,
    onSubmit,
    closeLoadingModal,
    loadingModalVisible,
    selectedLoan,
    selectNextLoan,
    totalDebt,
    onDeselectLoan,
  } = useSidebar();

  return (
    <>
      <SidebarLayout
        contentVisible={sidebarVisible}
        setVisible={toggleSidebar}
        isSidebarVisible={!!selection.length}
      >
        <CollapsedContent
          isVisible={sidebarVisible}
          onClick={onSubmit}
          title={`Bulk repay ${totalDebt?.toFixed(2)} SOL`}
        />
        <div
          className={classNames(styles.sidebar, {
            [styles.sidebarHidden]: sidebarVisible,
          })}
        >
          {selectedLoan && (
            <>
              <Slider
                nfts={selectedLoan?.nft}
                onDeselect={onDeselectLoan}
                onPrev={() => selectNextLoan(true)}
                onNext={() => selectNextLoan()}
                isBulkLoan={selection.length > 1}
              />
              <RepayForm
                onSubmit={onSubmit}
                loan={selectedLoan}
                totalPayback={totalDebt}
                isBulkRepay={selection.length > 1}
              />
            </>
          )}
        </div>
      </SidebarLayout>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to transfer the NFT/s approval is needed"
      />
    </>
  );
};
