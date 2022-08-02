import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io-client';
import { pickBy, allPass } from 'ramda';
import { isNotEmpty, isNotNil } from 'ramda-adjunct';

import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../../utils/transactions';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { captureSentryError } from '../../utils/sentry';
import { stringify } from '../../utils/state/qs';
import { liquidationsTypes, liquidationsActions } from './actions';
import { WonRaffleListItem } from './types';
import { networkRequest } from '../../utils/state';
import {
  selectConnection,
  selectWallet,
  selectWalletPublicKey,
  selectSocket,
} from '../common/selectors';
import { selectLotteryTickets } from './selectors';

const wonRafflesChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('won-raffles', (response) => emit(response));
    return () => socket.off('won-raffles');
  });

const lotteryTicketsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('lottery-tickets', (response) => emit(response));
    return () => socket.off('lottery-tickets');
  });

const raffleNotificationsChannel = (socket: Socket) =>
  eventChannel((emit) => {
    socket.on('raffle-notifications', (response) => emit(response));
    return () => socket.off('raffle-notifications');
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
  const qs = stringify(action.payload);
  yield put(liquidationsActions.fetchRaffleListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/liquidation${qs}&limit=1000`,
    });
    yield put(liquidationsActions.fetchRaffleListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchRaffleListFailed(error));
  }
};

const updateWonRaffleListSaga = function* (action) {
  if (!action.payload) {
    return;
  }
  const params: any = pickBy(allPass([isNotNil, isNotEmpty]), action.payload);
  const socket = yield select(selectSocket);
  const publicKey = yield select(selectWalletPublicKey);

  if (publicKey && socket) {
    socket.emit('won-raffles-subscribe', {
      wallet: publicKey,
      limit: 1000,
      ...params,
    });
  }
};

const fetchCollectionsListSaga = function* () {
  yield put(liquidationsActions.fetchCollectionsListPending());
  try {
    const data = yield call(networkRequest, {
      url: `https://${process.env.BACKEND_DOMAIN}/collection`,
    });
    yield put(liquidationsActions.fetchCollectionsListFulfilled(data));
  } catch (error) {
    yield put(liquidationsActions.fetchCollectionsListFailed(error));
  }
};

const txRaffleTrySaga = function* (action) {
  yield put(liquidationsActions.txRaffleTryPending());
  const connection = yield select(selectConnection);
  const publicKey = yield select(selectWalletPublicKey);
  const wallet = yield select(selectWallet);
  const lotteryTickets = yield select(selectLotteryTickets);

  let params;
  let tx;

  if (!lotteryTickets.tickets[0].stakeAccountPubkey) {
    params = {
      connection,
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      admin: new web3.PublicKey('11111111111111111111111111111111'),
      user: publicKey,
      liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
      attemptsNftMint: new web3.PublicKey(lotteryTickets.tickets[0].nftMint),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    };
    tx = loans.getLotTicket;
  } else {
    params = {
      connection,
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      admin: new web3.PublicKey('11111111111111111111111111111111'),
      user: publicKey,
      liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
      attemptsNftMint: new web3.PublicKey(lotteryTickets.tickets[0].nftMint),
      fraktNftStake: new web3.PublicKey(
        lotteryTickets.tickets[0].stakeAccountPubkey,
      ),
      sendTxn: async (transaction, signers) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          signers,
        });
      },
    };
    tx = loans.getLotTicketByStaking;
  }
  try {
    yield call(tx, params);
    yield put(
      liquidationsActions.txRaffleTryFulfilled(
        lotteryTickets.tickets[0].attemps &&
          lotteryTickets.tickets[0].attemps > 1
          ? ''
          : lotteryTickets.tickets[0].nftMint,
      ),
    );
  } catch (error) {
    yield put(liquidationsActions.txRaffleTryFailed(error));
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'getLotTicket',
      params,
    });
  }
};

const txLiquidateSaga = function* (action) {
  yield put(liquidationsActions.txLiquidatePending());
  const connection = yield select(selectConnection);
  const publicKey = yield select(selectWalletPublicKey);
  const wallet = yield select(selectWallet);

  const params = {
    connection,
    programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
    admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
    user: publicKey,
    liquidityPool: new web3.PublicKey(action.payload.liquidityPool),
    royaltyAddress: new web3.PublicKey(action.payload.royaltyAddress),
    lotTicket: new web3.PublicKey(action.payload.winningLotTicketPubkey),
    collectionInfo: new web3.PublicKey(action.payload.collectionInfo),
    loan: new web3.PublicKey(action.payload.loan),
    liquidationLot: new web3.PublicKey(action.payload.liquidationLotPubkey),
    nftMint: new web3.PublicKey(action.payload.nftMint),
    sendTxn: async (transaction) => {
      await signAndConfirmTransaction({
        transaction,
        connection,
        wallet,
      });
    },
  };
  try {
    yield call(loans.redeemWinningLotTicket, params);
    yield put(liquidationsActions.txLiquidateFulfilled(action.payload.nftMint));
  } catch (error) {
    yield put(liquidationsActions.txLiquidateFailed(error));
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({
      error,
      wallet,
      transactionName: 'redeemWinningLotTicket',
      params,
    });
  }
};

const subscribeWonRaffleListSaga = function* (list: WonRaffleListItem[]) {
  yield put(liquidationsActions.setWonRaffleList(list));
};

const subscribeLotteryTicketsSaga = function* (list) {
  yield put(liquidationsActions.setLotteryTicketsList(list));
};

const subscribeRaffleNotificationsSaga = function* (loans) {
  yield put(liquidationsActions.setRaffleNotifications(loans));
};

const liquidationsSagas = (socket: Socket) =>
  function* (): Generator {
    const wonRafflesStream: any = yield call(wonRafflesChannel, socket);
    const lotteryTicketsStream: any = yield call(lotteryTicketsChannel, socket);
    const raffleNotificationsStream: any = yield call(
      raffleNotificationsChannel,
      socket,
    );

    yield all([
      takeLatest(liquidationsTypes.FETCH_GRACE_LIST, fetchGraceListSaga),
    ]);
    yield all([
      takeLatest(liquidationsTypes.FETCH_RAFFLE_LIST, fetchRaffleListSaga),
    ]);
    yield all([
      takeLatest(
        liquidationsTypes.UPDATE_WON_RAFFLE_LIST,
        updateWonRaffleListSaga,
      ),
    ]);
    yield all([
      takeLatest(
        liquidationsTypes.FETCH_COLLECTIONS_LIST,
        fetchCollectionsListSaga,
      ),
    ]);
    yield all([takeLatest(liquidationsTypes.TX_RAFFLE_TRY, txRaffleTrySaga)]);
    yield all([takeLatest(liquidationsTypes.TX_LIQUIDATE, txLiquidateSaga)]);
    yield all([takeLatest(wonRafflesStream, subscribeWonRaffleListSaga)]);
    yield all([takeLatest(lotteryTicketsStream, subscribeLotteryTicketsSaga)]);
    yield all([
      takeLatest(raffleNotificationsStream, subscribeRaffleNotificationsSaga),
    ]);
  };

export default liquidationsSagas;
