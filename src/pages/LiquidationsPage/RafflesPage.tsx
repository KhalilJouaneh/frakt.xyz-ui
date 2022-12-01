import { FC } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import Liquidations from './components/Liquidations';
import styles from './RafflesPage.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SORT = 'sort',
}

const RafflesPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Raffles</h1>
          <h2 className={styles.subtitle}>
            Buyout liquidated NFTs on discount
          </h2>
        </div>
      </div>
      <Liquidations />
    </AppLayout>
  );
};

export default RafflesPage;
