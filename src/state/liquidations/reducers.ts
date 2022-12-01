import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';
import {
  GraceListItem,
  RaffleListItem,
  WonRaffleListItem,
  CollectionsListItem,
} from './types';

export const initialGraceListState: AsyncState<GraceListItem[]> =
  createInitialAsyncState<GraceListItem[]>(null);

export const initialRaffleListState: AsyncState<RaffleListItem[]> =
  createInitialAsyncState<RaffleListItem[]>(null);

export const initialCollectionsListState: AsyncState<CollectionsListItem[]> =
  createInitialAsyncState<CollectionsListItem[]>(null);

export const initialWonRaffleListState: AsyncState<WonRaffleListItem[]> =
  createInitialAsyncState<WonRaffleListItem[]>(null);

export const initialRaffleNotificationsState: AsyncState<any[]> =
  createInitialAsyncState<any[]>(null);

export const initialLotteryTicketsListState: AsyncState<any> =
  createInitialAsyncState<any>(null);

export const initialTxState: AsyncState<unknown> =
  createInitialAsyncState<unknown>(null);

const fetchGraceListReducer = createReducer(
  initialGraceListState,
  createHandlers<GraceListItem[]>(liquidationsTypes.FETCH_GRACE_LIST),
);

const fetchRaffleListReducer = createReducer(
  initialRaffleListState,
  createHandlers<RaffleListItem[]>(liquidationsTypes.FETCH_RAFFLE_LIST),
);

const fetchCollectionsListReducer = createReducer(
  initialCollectionsListState,
  createHandlers<CollectionsListItem[]>(
    liquidationsTypes.FETCH_COLLECTIONS_LIST,
  ),
);

const fetchWonRaffleListReducer = createReducer(
  initialWonRaffleListState,
  createHandlers<WonRaffleListItem[]>(liquidationsTypes.FETCH_WON_RAFFLE_LIST),
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
  graceList: fetchGraceListReducer,
  raffleList: fetchRaffleListReducer,
  collectionsList: fetchCollectionsListReducer,
  wonRaffleList: fetchWonRaffleListReducer,
  raffleNotifications: setRaffleNotificationsReducer,
  lotteryTicketsList: setLotteryTicketsListReducer,
});
