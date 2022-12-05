import { createCustomAction } from 'typesafe-actions';

import { CollectionsListItem } from './types';
import { ServerError } from '../../utils/state';

export const liquidationsTypes = {
  FETCH_COLLECTIONS_LIST: 'liquidations/FETCH_COLLECTIONS_LIST',
  FETCH_COLLECTIONS_LIST__PENDING:
    'liquidations/FETCH_COLLECTIONS_LIST__PENDING',
  FETCH_COLLECTIONS_LIST__FULFILLED:
    'liquidations/FETCH_COLLECTIONS_LIST__FULFILLED',
  FETCH_COLLECTIONS_LIST__FAILED: 'liquidations/FETCH_COLLECTIONS_LIST__FAILED',
  SET_LOTTERY_TICKETS_LIST: 'liquidations/SET_LOTTERY_TICKETS_LIST',
  SET_RAFFLE_NOTIFICATIONS: 'liquidations/SET_RAFFLE_NOTIFICATIONS',
};

export const liquidationsActions = {
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
  setLotteryTicketsList: createCustomAction(
    liquidationsTypes.SET_LOTTERY_TICKETS_LIST,
    (response) => ({ payload: response }),
  ),
  setRaffleNotifications: createCustomAction(
    liquidationsTypes.SET_RAFFLE_NOTIFICATIONS,
    (response) => ({ payload: response }),
  ),
};
