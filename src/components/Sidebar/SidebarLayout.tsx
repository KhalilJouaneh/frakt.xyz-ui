import { FC, ReactNode } from 'react';
import cx from 'classnames';

import Button from '@frakt/components/Button';
import styles from './SidebarLayout.module.scss';
import { Chevron } from '@frakt/icons';

interface SidebarLayoutProps {
  isSidebarVisible?: boolean;
  contentVisible?: boolean;
  setVisible: () => void;
  children: ReactNode;
  className?: string;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({
  isSidebarVisible,
  contentVisible,
  setVisible,
  children,
  className,
}) => {
  return (
    <div
      className={cx(
        styles.sidebarWrapper,
        { [styles.visible]: isSidebarVisible },
        { [styles.collapsedSidebar]: contentVisible },
        className,
      )}
    >
      <div
        className={cx(styles.dropdown, {
          [styles.dropdownHidden]: !isSidebarVisible,
        })}
        onClick={setVisible}
      >
        <Button
          className={cx(styles.btn, { [styles.rotateUp]: contentVisible })}
          type="tertiary"
        >
          <Chevron />
        </Button>
      </div>
      {children}
    </div>
  );
};

export default SidebarLayout;
