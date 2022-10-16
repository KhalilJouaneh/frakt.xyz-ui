import { useEffect, FC } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Tab, Tabs, useTabs } from '../../components/Tabs';
import { ProfileCard } from './components/ProfileCard';
import { LoansList } from './components/LoansList';
import styles from './WalletPage.module.scss';
import { usePublicKeyParam } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNameService } from './hooks';
import {
  selectUser,
  selectWalletPublicKey,
} from '../../state/common/selectors';
import { Loan } from '../../state/loans/types';
import { selectLoanNfts } from '../../state/loans/selectors';
import { ConnectWalletSection } from '../../components/ConnectWalletSection';

interface WalletPageProps {
  history: any;
}

export enum WalletTabs {
  TOKENS = 'tokens',
  VAULTS = 'vaults',
  LOANS = 'loans',
}

const useWalletPage = () => {
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  usePublicKeyParam(walletPubkey);

  const wallet = useWallet();

  const { nameServiceInfo } = useNameService({ walletPubkey });

  const isMyProfile = walletPubkey === wallet.publicKey?.toBase58();

  const {
    tabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: isMyProfile ? POOL_TABS_MY : POOL_TABS,
    defaultValue: (isMyProfile ? POOL_TABS_MY : POOL_TABS)[0].value,
  });

  return {
    tabs,
    tabValue,
    setTabValue,
    isMyProfile,
    nameServiceInfo,
    walletPubkey,
  };
};

const WalletPage: FC<WalletPageProps> = (props) => {
  const { tabs, tabValue, setTabValue, nameServiceInfo, walletPubkey } =
    useWalletPage();
  const user = useSelector(selectUser);
  const userLoans: Loan[] = useSelector(selectLoanNfts);
  const wallet = useSelector(selectWalletPublicKey);
  const { connected } = useWallet();

  useEffect(() => {
    if (!wallet) {
      props.history.push('/');
    }
  }, [wallet]);

  return (
    <AppLayout>
      <h2 className={styles.title}>My profile</h2>
      {connected ? (
        <div className={styles.content}>
          <ProfileCard
            walletPubkey={walletPubkey}
            name={nameServiceInfo?.domain}
            twitterName={nameServiceInfo?.twitterHandle}
            user={user}
          />
          <div className={styles.tabsContent}>
            <Tabs
              className={styles.tabs}
              tabs={tabs}
              value={tabValue}
              setValue={setTabValue}
            />
            {tabValue === WalletTabs.LOANS && (
              <LoansList loans={userLoans} className={styles.loansList} />
            )}
          </div>
        </div>
      ) : (
        <ConnectWalletSection text="Connect your wallet to check my profile" />
      )}
    </AppLayout>
  );
};

export default withRouter(WalletPage);

const POOL_TABS: Tab[] = [
  {
    label: 'Tokens',
    value: 'tokens',
  },
];

const POOL_TABS_MY: Tab[] = [
  {
    label: 'Loans',
    value: 'loans',
  },
  ...POOL_TABS,
];
