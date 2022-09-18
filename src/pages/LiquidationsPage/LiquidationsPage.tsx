import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import Liquidations from './components/Liquidations';
import styles from './LiquidationsPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const LiquidationsPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Liquidations</h1>
          <h2 className={styles.subtitle}>
            Buyout liquidated NFTs on discount
          </h2>
        </div>
      </div>
      <Liquidations />
    </AppLayout>
  );
};

export default LiquidationsPage;
