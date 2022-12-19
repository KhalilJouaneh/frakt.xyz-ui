import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { AsyncState } from '../../utils/state';
import {
  createHandlers,
  createInitialAsyncState,
} from '../../utils/state/reducers';
import { liquidationsTypes } from './actions';

export const initialLotteryTicketsListState: AsyncState<any> =
  createInitialAsyncState<any>(null);

export const initialTxState: AsyncState<unknown> =
  createInitialAsyncState<unknown>(null);

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
  lotteryTicketsList: setLotteryTicketsListReducer,
});
