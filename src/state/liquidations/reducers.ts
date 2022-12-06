import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';
import { RaffleListItem, CollectionsListItem } from './types';

export const initialRaffleListState: AsyncState<RaffleListItem[]> =
  createInitialAsyncState<RaffleListItem[]>(null);

export const initialCollectionsListState: AsyncState<CollectionsListItem[]> =
  createInitialAsyncState<CollectionsListItem[]>(null);

export const initialRaffleNotificationsState: AsyncState<any[]> =
  createInitialAsyncState<any[]>(null);

export const initialLotteryTicketsListState: AsyncState<any> =
  createInitialAsyncState<any>(null);

export const initialTxState: AsyncState<unknown> =
  createInitialAsyncState<unknown>(null);

const fetchCollectionsListReducer = createReducer(
  initialCollectionsListState,
  createHandlers<CollectionsListItem[]>(
    liquidationsTypes.FETCH_COLLECTIONS_LIST,
  ),
);

const setRaffleNotificationsReducer = createReducer(
  initialRaffleNotificationsState,
  {
    [liquidationsTypes.SET_RAFFLE_NOTIFICATIONS]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
);

const setLotteryTicketsListReducer = createReducer(
  initialLotteryTicketsListState,
  {
    [liquidationsTypes.SET_LOTTERY_TICKETS_LIST]: (state, action) => ({
      ...state,
      data: action.payload,
    }),
  },
);

export default combineReducers({
  collectionsList: fetchCollectionsListReducer,
  raffleNotifications: setRaffleNotificationsReducer,
  lotteryTicketsList: setLotteryTicketsListReducer,
});
