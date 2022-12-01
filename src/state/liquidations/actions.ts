import { createCustomAction } from 'typesafe-actions';

import {
  GraceListItem,
  FetchItemsParams,
  RaffleListItem,
  CollectionsListItem,
  WonRaffleListItem,
} from './types';
import { ServerError } from '../../utils/state';

export const liquidationsTypes = {
  FETCH_GRACE_LIST: 'liquidations/FETCH_GRACE_LIST',
  FETCH_GRACE_LIST__PENDING: 'liquidations/FETCH_GRACE_LIST__PENDING',
  FETCH_GRACE_LIST__FULFILLED: 'liquidations/FETCH_GRACE_LIST__FULFILLED',
  FETCH_GRACE_LIST__FAILED: 'liquidations/FETCH_GRACE_LIST__FAILED',
  FETCH_RAFFLE_LIST: 'liquidations/FETCH_RAFFLE_LIST',
  FETCH_RAFFLE_LIST__PENDING: 'liquidations/FETCH_RAFFLE_LIST__PENDING',
  FETCH_RAFFLE_LIST__FULFILLED: 'liquidations/FETCH_RAFFLE_LIST__FULFILLED',
  FETCH_RAFFLE_LIST__FAILED: 'liquidations/FETCH_RAFFLE_LIST__FAILED',
  FETCH_COLLECTIONS_LIST: 'liquidations/FETCH_COLLECTIONS_LIST',
  FETCH_COLLECTIONS_LIST__PENDING:
    'liquidations/FETCH_COLLECTIONS_LIST__PENDING',
  FETCH_COLLECTIONS_LIST__FULFILLED:
    'liquidations/FETCH_COLLECTIONS_LIST__FULFILLED',
  FETCH_COLLECTIONS_LIST__FAILED: 'liquidations/FETCH_COLLECTIONS_LIST__FAILED',
  FETCH_WON_RAFFLE_LIST: 'liquidations/FETCH_WON_RAFFLE_LIST',
  FETCH_WON_RAFFLE_LIST__PENDING: 'liquidations/FETCH_WON_RAFFLE_LIST__PENDING',
  FETCH_WON_RAFFLE_LIST__FULFILLED:
    'liquidations/FETCH_WON_RAFFLE_LIST__FULFILLED',
  FETCH_WON_RAFFLE_LIST__FAILED: 'liquidations/FETCH_WON_RAFFLE_LIST__FAILED',
  SET_LOTTERY_TICKETS_LIST: 'liquidations/SET_LOTTERY_TICKETS_LIST',
  SET_RAFFLE_NOTIFICATIONS: 'liquidations/SET_RAFFLE_NOTIFICATIONS',
};

export const liquidationsActions = {
  fetchGraceList: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST,
    (params?: FetchItemsParams) => ({ payload: params }),
  ),
  fetchGraceListPending: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__PENDING,
    () => null,
  ),
  fetchGraceListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FULFILLED,
    (response: GraceListItem[]) => ({ payload: response }),
  ),
  fetchGraceListFailed: createCustomAction(
    liquidationsTypes.FETCH_GRACE_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  fetchRaffleList: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST,
    (params?: FetchItemsParams) => ({ payload: params }),
  ),
  fetchRaffleListPending: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__PENDING,
    () => null,
  ),
  fetchRaffleListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__FULFILLED,
    (response: RaffleListItem[]) => ({ payload: response }),
  ),
  fetchRaffleListFailed: createCustomAction(
    liquidationsTypes.FETCH_RAFFLE_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  fetchCollectionsList: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST,
    () => null,
  ),
  fetchCollectionsListPending: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__PENDING,
    () => null,
  ),
  fetchCollectionsListFulfilled: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__FULFILLED,
    (response: {
      raffleCollections: CollectionsListItem[];
      graceCollections: CollectionsListItem[];
    }) => ({ payload: response }),
  ),
  fetchCollectionsListFailed: createCustomAction(
    liquidationsTypes.FETCH_COLLECTIONS_LIST__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
  fetchWonRaffleList: createCustomAction(
    liquidationsTypes.FETCH_WON_RAFFLE_LIST,
    (params?: FetchItemsParams) => ({ payload: params }),
  ),
  fetchWonRafflePending: createCustomAction(
    liquidationsTypes.FETCH_WON_RAFFLE_LIST__PENDING,
    () => null,
  ),
  fetchWonRaffleFulfilled: createCustomAction(
    liquidationsTypes.FETCH_WON_RAFFLE_LIST,
    (response: WonRaffleListItem[]) => ({ payload: response }),
  ),
  fetchWonRaffleFailed: createCustomAction(
    liquidationsTypes.FETCH_WON_RAFFLE_LIST,
    (error: ServerError) => ({ payload: error }),
  ),
  setLotteryTicketsList: createCustomAction(
    liquidationsTypes.SET_LOTTERY_TICKETS_LIST,
    (response) => ({ payload: response }),
  ),
  setRaffleNotifications: createCustomAction(
    liquidationsTypes.SET_RAFFLE_NOTIFICATIONS,
    (response) => ({ payload: response }),
  ),
};
