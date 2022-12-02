import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import { stringify } from '../../utils/state/qs';
import { liquidationsTypes, liquidationsActions } from './actions';
import { networkRequest } from '../../utils/state';
import { selectWalletPublicKey } from '../common/selectors';

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const fetchGraceListSaga = function* (action) {
  if (!action.payload) {
    return;
  }
  const qs = stringify(action.payload);
  yield put(liquidationsActions.fetchGraceListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-list${qs}&limit=1000`,
    });
    yield put(liquidationsActions.fetchGraceListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchGraceListFailed(error));
  }
};

const fetchRaffleListSaga = function* (action) {
  if (!action.payload) {
    return;
  }
  const publicKey = yield select(selectWalletPublicKey);
  const qs = stringify(action.payload);

  yield put(liquidationsActions.fetchRaffleListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation${qs}&limit=1000&user=${publicKey}`,
    });

    yield put(liquidationsActions.fetchRaffleListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchRaffleListFailed(error));
  }
};

const fetchCollectionsListSaga = function* () {
  yield put(liquidationsActions.fetchCollectionsListPending());
  try {
    const { raffleCollections, graceCollections } = yield all({
      raffleCollections: call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/liquidation/raffle-collections`,
      }),
      graceCollections: call(networkRequest, {
        url: `https://${process.env.BACKEND_DOMAIN}/liquidation/grace-collections`,
      }),
    });
    yield put(
      liquidationsActions.fetchCollectionsListFulfilled({
        raffleCollections,
        graceCollections,
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
      takeLatest(liquidationsTypes.FETCH_GRACE_LIST, fetchGraceListSaga),
    ]);
    yield all([
      takeLatest(liquidationsTypes.FETCH_RAFFLE_LIST, fetchRaffleListSaga),
    ]);
    yield all([
      takeLatest(
        liquidationsTypes.FETCH_COLLECTIONS_LIST,
        fetchCollectionsListSaga,
      ),
    ]);
    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
  };

export default liquidationsSagas;
