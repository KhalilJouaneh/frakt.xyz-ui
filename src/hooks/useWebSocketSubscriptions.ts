import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useLocation } from 'react-router-dom';

import { selectSocket } from '../state/common/selectors';
import { commonActions } from '../state/common/actions';

export const useWebSocketSubscriptions = (): void => {
  const wallet = useWallet();
  // const { connected, publicKey } = wallet;
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);

  const { search } = useLocation();
  const privatePoolHash = useMemo(
    () => new URLSearchParams(search).get('pph'),
    [search],
  );

  useEffect(() => {
    if (wallet.connected) {
      dispatch(commonActions.setWallet(wallet));
    }
  }, [dispatch, wallet]);

  const subscribe = useCallback(() => {
    if (wallet.publicKey) {
      socket.emit('loan-subscribe', wallet.publicKey);
      if (privatePoolHash) {
        socket.emit('lending-subscribe', {
          wallet: wallet.publicKey,
          privatePoolHash,
        });
      } else {
        socket.emit('lending-subscribe', wallet.publicKey);
      }
    } else {
      socket.emit('lending-subscribe');
    }
  }, [privatePoolHash, wallet, socket]);

  useEffect(() => {
    if (socket) {
      subscribe();
    }
  }, [subscribe, socket]);
};
