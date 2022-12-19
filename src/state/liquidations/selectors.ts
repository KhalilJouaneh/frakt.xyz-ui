import { createSelector } from 'reselect';
import { pathOr, identity } from 'ramda';

import { LotteryTicket } from './types';

export const selectLotteryTickets: (state) => LotteryTicket = createSelector(
  [pathOr(null, ['liquidations', 'lotteryTicketsList', 'data'])],
  identity,
);
