import { FC } from 'react';

import Sidebar from './components/Sidebar';
import { AppLayout } from '../Layout/AppLayout';
import styles from './SelectLayout.module.scss';
import { BorrowNft } from '../../state/loans/types';

interface SelectLayoutProps {
  selectedNfts: BorrowNft[];
  onDeselect?: (nft: BorrowNft) => void;
  sidebarForm: JSX.Element;
  isCloseSidebar?: boolean;
}

export const SelectLayout: FC<SelectLayoutProps> = ({
  children,
  selectedNfts,
  onDeselect,
  sidebarForm,
  isCloseSidebar,
}) => {
  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        nfts={selectedNfts}
        onDeselect={onDeselect}
        sidebarForm={sidebarForm}
        isCloseSidebar={isCloseSidebar}
      />
      <div id="content-reducer">{children}</div>
    </AppLayout>
  );
};
