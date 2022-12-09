import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  LendPage,
  LiquidationsPage,
  LoansPage,
  BorrowPage,
  BondsPoolPage,
  BondPage,
  PoolsCreationPage,
} from '../pages';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  {
    exact: true,
    path: PATHS.LEND,
    component: LendPage,
  },
  {
    exact: true,
    path: PATHS.LIQUIDATIONS,
    component: LiquidationsPage,
  },
  {
    exact: true,
    path: PATHS.LOANS,
    component: LoansPage,
  },
  {
    exact: true,
    path: PATHS.BONDS,
    component: BondsPoolPage,
  },
  {
    exact: true,
    path: PATHS.BOND,
    component: BondPage,
  },
  {
    exact: true,
    path: PATHS.POOLS_CREATION,
    component: PoolsCreationPage,
  },
  {
    exact: true,
    path: PATHS.BORROW,
    component: BorrowPage,
  },
  {
    exact: true,
    path: PATHS.ROOT,
    component: HomePage,
  },
  {
    exact: true,
    path: PATHS.PAGE_404,
    component: Page404,
  },
  {
    exact: true,
    path: '*',
    component: Page404,
  },
];
