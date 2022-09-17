import { FC } from 'react';
import classNames from 'classnames';

import { BorrowNft } from '../../../../state/loans/types';
import styles from './Sidebar.module.scss';
import { useSidebar } from './hooks';
import { Slider } from '../Slider';

export interface SidebarProps {
  onDeselect?: (nft: BorrowNft) => void;
  nfts: BorrowNft[];
  sidebarForm: JSX.Element;
  isCloseSidebar: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  onDeselect,
  nfts,
  sidebarForm,
  isCloseSidebar = false,
}) => {
  const { isSidebarVisible, isHeaderHidden, isSidebarCollapsed } =
    useSidebar(nfts);

  return (
    <>
      {!isCloseSidebar && (
        <>
          <div
            className={classNames([
              styles.sidebarWrapper,
              { [styles.visible]: isSidebarVisible },
              { [styles.collapsed]: isSidebarCollapsed },
              { [styles.headerHidden]: isHeaderHidden },
            ])}
          >
            <div className={styles.sidebar}>
              <Slider nfts={nfts} onDeselect={onDeselect} />
              {isSidebarVisible && sidebarForm}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
