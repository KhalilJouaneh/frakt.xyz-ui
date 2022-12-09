import { all, call, takeLatest, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';

import { liquidationsActions } from './actions';

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const subscribeLotteryTicketsSaga = function* (list) {
  yield put(liquidationsActions.setLotteryTicketsList(list));
};

const liquidationsSagas = (socket: Socket) =>
  function* (): Generator {
    const lotteryTicketsStream: any = yield call(lotteryTicketsChannel, socket);

    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
  };

export default liquidationsSagas;
