import { all, call, takeLatest, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import { liquidationsTypes, liquidationsActions } from './actions';
import { networkRequest } from '../../utils/state';

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const fetchCollectionsListSaga = function* () {
  yield put(liquidationsActions.fetchCollectionsListPending());
  try {
    const { raffleCollections, graceCollections, historyCollections } =
      yield all({
        raffleCollections: call(networkRequest, {
          url: `https://${process.env.BACKEND_DOMAIN}/liquidation/raffle-collections`,
        }),
        graceCollections: call(networkRequest, {
          url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-collections`,
        }),
        historyCollections: call(networkRequest, {
          url: `https://${process.env.BACKEND_DOMAIN}/liquidation/history-collections`,
        }),
      });
    yield put(
      liquidationsActions.fetchCollectionsListFulfilled({
        raffleCollections,
        graceCollections,
        historyCollections,
      }),
    );
  } catch (error) {
    yield put(liquidationsActions.fetchCollectionsListFailed(error));
  }
};

const subscribeLotteryTicketsSaga = function* (list) {
  yield put(liquidationsActions.setLotteryTicketsList(list));
};

const liquidationsSagas = (socket: Socket) =>
  function* (): Generator {
    const lotteryTicketsStream: any = yield call(lotteryTicketsChannel, socket);

    yield all([
      takeLatest(
        liquidationsTypes.FETCH_COLLECTIONS_LIST,
        fetchCollectionsListSaga,
      ),
    ]);
    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
  };

export default liquidationsSagas;
