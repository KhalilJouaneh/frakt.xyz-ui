import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';

// import CollapsedContent from '@frakt/components/Sidebar/components/CollapsedContent';
// import { useSidebarVisible } from '@frakt/components/Sidebar/hooks';
// import Slider from '@frakt/componentsSidebar/components/Slider';
import { LoadingModal } from '@frakt/components/LoadingModal';
// import SidebarLayout from '@frakt/components/Sidebar';
import { useSidebarForm } from './useSidebarForm';
import styles from './SidebarForm.module.scss';
import RepayForm from '../RepayForm';
import {
  useSelectableNftsState,
  useSelectableNfts,
} from '@frakt/pages/LoansPage/hooks';

const SidebarForm: FC = () => {
  const { publicKey } = useWallet();
  const { onNftClick } = useSelectableNfts();
  const { currentSelectedId, setSelectedNfts, selectedNfts } =
    useSelectableNftsState();

  //   const { visible: sidebarVisible, toggle: toggleSidebar } =
  //     useSidebarVisible();

  useEffect(() => {
    setSelectedNfts([]);
  }, [publicKey]);

  const {
    closeLoadingModal,
    loadingModalVisible,
    onSubmit,
    onNextNft,
    onPrevNft,
    currentNft,
    totalPayback,
  } = useSidebarForm();

  return (
    <>
      {/* <SidebarLayout
        contentVisible={sidebarVisible}
        setVisible={toggleSidebar}
        isSidebarVisible={!!selectedNfts.length}
      >
        <CollapsedContent
          isVisible={sidebarVisible}
          onClick={onSubmit}
          title={`Bulk repay ${totalPayback?.toFixed(2)} SOL`}
        />
        <div
          className={cx(styles.sidebar, {
            [styles.sidebarHidden]: sidebarVisible,
          })}
        >
          <Slider
            nfts={currentNft}
            onDeselect={onNftClick}
            onPrev={() => onPrevNft(currentSelectedId - 1)}
            onNext={() => onNextNft(currentSelectedId + 1)}
            isBulkLoan={selectedNfts.length > 1}
          />
          <RepayForm
            onSubmit={onSubmit}
            nft={currentNft}
            totalPayback={totalPayback}
            isBulkRepay={selectedNfts.length > 1}
          />
        </div>
      </SidebarLayout> */}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to transfer the NFT/s approval is needed"
      />
    </>
  );
};

export default SidebarForm;
