import { createSelector } from 'reselect';
import { pathOr, identity, map, reject, useWith, pluck } from 'ramda';

import { LotteryTicket } from './types';

export const selectLotteryTickets: (state) => LotteryTicket = createSelector(
  [pathOr(null, ['liquidations', 'lotteryTicketsList', 'data'])],
  identity,
);

export const selectRaffleCollectionsDropdownData = createSelector(
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

export const selectGraceCollectionsDropdownData = createSelector(
  [pathOr([], ['liquidations', 'collectionsList', 'data', 'graceCollections'])],
  map((item: any) => ({
    label: item,
    value: item,
  })),
);
