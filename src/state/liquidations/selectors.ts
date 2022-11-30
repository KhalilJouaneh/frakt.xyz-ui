import { createSelector } from 'reselect';
import {
  pathOr,
  identity,
  map,
  reject,
  useWith,
  pluck,
  compose,
  mapObjIndexed,
  groupBy,
  prop,
  length,
} from 'ramda';

import { LotteryTicket, RaffleListItem } from './types';

export const selectGraceList = createSelector(
  [pathOr([], ['liquidations', 'graceList', 'data'])],
  identity,
);

export const selectWonRaffleList = createSelector(
  [pathOr([], ['liquidations', 'wonRaffleList', 'data'])],
  identity,
);

export const selectRaffleList = createSelector(
  [pathOr([], ['liquidations', 'raffleList', 'data']), selectWonRaffleList],
  useWith(
    (raffleList: Array<RaffleListItem>, wonMints: string[]) =>
      reject(
        (item: RaffleListItem) => wonMints.includes(item.nftMint),
        raffleList,
      ),
    [identity, pluck('nftMint')],
  ),
);

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

export const selectRaffleNotifications = createSelector(
  [pathOr([], ['liquidations', 'raffleNotifications', 'data'])],
  compose(mapObjIndexed(length), groupBy(prop('ticketState'))),
);
