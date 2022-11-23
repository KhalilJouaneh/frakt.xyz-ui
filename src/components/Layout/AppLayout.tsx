import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import { HeaderStateProvider, useHeaderState } from './headerState';
import NotificationBar from '../NotificationBar';
import styles from './styles.module.scss';

interface LayoutProps {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  className?: string;
  contentClassName?: string;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { onContentScroll } = useHeaderState();

  useEffect(() => {
    dispatch(commonActions.setWalletModal({ isVisible: false }));
  }, [dispatch]);

  return (
    <div id="app-content" onScroll={onContentScroll} className={styles.content}>
      {children}
      <NotificationBar />
    </div>
  );
};

export const AppLayout: FC<LayoutProps> = ({ children, ...props }) => (
  <HeaderStateProvider>
    <Layout {...props}>{children}</Layout>
  </HeaderStateProvider>
);
