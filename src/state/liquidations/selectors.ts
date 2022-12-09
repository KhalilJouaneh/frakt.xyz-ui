import { createSelector } from 'reselect';
import { pathOr, identity, map } from 'ramda';

import { LotteryTicket } from './types';

export const selectLotteryTickets: (state) => LotteryTicket = createSelector(
  [pathOr(null, ['liquidations', 'lotteryTicketsList', 'data'])],
  identity,
);

export const selectRaffleCollections = createSelector(
  [
    pathOr(
      [],
      ['liquidations', 'collectionsList', 'data', 'raffleCollections'],
    ),
  ],
  map((item: any) => ({
    label: item,
    value: item,
  })),
);

export const selectGraceCollections = createSelector(
  [pathOr([], ['liquidations', 'collectionsList', 'data', 'graceCollections'])],
  map((item: any) => ({
    label: item,
    value: item,
  })),
);
export const selectHistoryCollections = createSelector(
  [
    pathOr(
      [],
      ['liquidations', 'collectionsList', 'data', 'historyCollections'],
    ),
  ],
  map((item: any) => ({
    label: item,
    value: item,
  })),
);
