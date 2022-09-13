import { createSelector } from 'reselect';
import {
  pathOr,
  identity,
  applySpec,
  map,
  converge,
  concat,
  evolve,
  filter,
  reject,
  useWith,
  pluck,
  compose,
  mapObjIndexed,
  groupBy,
  prop,
  length,
  sum,
  always,
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

const selectIgnoreLotteryTickets = createSelector(
  [pathOr([], ['liquidations', 'ignoreLotteryTicketsList'])],
  identity,
);

const gatherNfts = converge(
  (nftMints: number[], _stakedNfts: any) => {
    const rawNfts = map(
      applySpec({ nftMint: identity, attempts: always(1) }),
      nftMints,
    );
    const stakedNfts = filter((item: any) => item.attempts > 0, _stakedNfts);
    return concat(rawNfts, stakedNfts);
  },
  [pathOr([], ['nftMints']), pathOr([], ['stakedNfts'])],
);

const selectRawLotteryTickets = createSelector(
  [pathOr({}, ['liquidations', 'lotteryTicketsList', 'data'])],
  applySpec<{ quantity: number; tickets: LotteryTicket[] }>({
    quantity: gatherNfts,
    tickets: gatherNfts,
  }),
);

export const selectLotteryTickets = createSelector(
  [selectRawLotteryTickets, selectIgnoreLotteryTickets],
  (lotteryTickets, ignoreNfts) => {
    return evolve(
      {
        quantity: compose(
          sum,
          pluck('attempts'),
          reject((ticket: any) => ignoreNfts.includes(ticket.nftMint)),
        ),
        tickets: reject((ticket: any) => ignoreNfts.includes(ticket.nftMint)),
      },
      lotteryTickets,
    );
  },
);

export const selectTxRaffleTryStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txRaffleTry', 'status'])],
  (v) => v,
);

export const selectTxLiquidateStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txLiquidate', 'status'])],
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
