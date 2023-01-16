import { FC } from 'react';

import { PATHS } from './paths';
import {
  Page404,
  HomePage,
  LendPage,
  LiquidationsPage,
  LoansPage,
  BorrowPage,
  MarketsPage,
  MarketPage,
  PoolsCreationPage,
} from '@frakt/pages';
import {
  BorrowRootPage,
  BorrowBulkSuggestionPage,
  BorrowBulkOverviewPage,
  BorrowSuccessPage,
} from '@frakt/pages/BorrowPages';

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
    component: MarketsPage,
  },
  {
    exact: true,
    path: `${PATHS.BOND}/:marketPubkey`,
    component: MarketPage,
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
    path: PATHS.BORROW_ROOT,
    component: BorrowRootPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_BULK_SUGGESTION,
    component: BorrowBulkSuggestionPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_BULK_OVERVIEW,
    component: BorrowBulkOverviewPage,
  },
  {
    exact: true,
    path: PATHS.BORROW_SUCCESS,
    component: BorrowSuccessPage,
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
