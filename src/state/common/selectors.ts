import { createSelector } from 'reselect';
import { Socket } from 'socket.io-client';
import { pathOr, identity } from 'ramda';
import moment from 'moment';

export const selectSolanaHealth = createSelector(
  [pathOr(null, ['common', 'solanaHealth', 'data'])],
  identity,
);

export const selectSolanaTimestamp = createSelector(
  [pathOr(moment().unix(), ['common', 'fetchSolanaTimestamp', 'data'])],
  identity,
);

export const selectNotification = createSelector(
  [pathOr(null, ['common', 'notification'])],
  identity,
);

export const selectWalletModalVisible = createSelector(
  [pathOr(false, ['common', 'walletModal', 'isVisible'])],
  identity,
);

export const selectConnection = createSelector(
  [pathOr(null, ['common', 'connection', 'connection'])],
  identity,
);

export const selectSocket = createSelector(
  [pathOr(null, ['common', 'socket', 'socket'])],
  (socket: Socket) => socket,
);

export const selectWallet = createSelector(
  [pathOr({}, ['common', 'wallet', 'wallet'])],
  identity,
);

export const selectWalletPublicKey = createSelector(
  [pathOr('', ['common', 'wallet', 'wallet', 'publicKey'])],
  identity,
);

export const selectConfettiVisible = createSelector(
  [pathOr(false, ['common', 'confetti', 'isVisible'])],
  identity,
);

export const selectSelectedNftId = createSelector(
  [pathOr(0, ['common', 'selectedNftId', 'id'])],
  identity,
);
