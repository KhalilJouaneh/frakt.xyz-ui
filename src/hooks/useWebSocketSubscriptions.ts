import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { selectSocket } from '../state/common/selectors';
import { commonActions } from '../state/common/actions';

export const useWebSocketSubscriptions = (): void => {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if (wallet.connected) {
      dispatch(commonActions.setWallet(wallet));
      dispatch(commonActions.fetchUser(wallet.publicKey));
    }
  }, [dispatch, wallet]);

  useEffect(() => {
    if (socket) {
      if (connected) {
        socket.emit('loan-subscribe', publicKey);
        socket.emit('lending-subscribe', publicKey);
      } else {
        socket.emit('lending-subscribe');
      }
    }
  }, [socket, connected, publicKey]);
};
