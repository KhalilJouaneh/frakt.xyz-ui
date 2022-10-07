import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectSocket } from '../../../state/common/selectors';

export const usePrivateLendingPools = (): void => {
  const socket = useSelector(selectSocket);
  const wallet = useWallet();
  const { search } = useLocation();
  const privatePoolHash = useMemo(
    () => new URLSearchParams(search).get('pph'),
    [search],
  );

  const subscribe = useCallback(() => {
    socket.emit('lending-subscribe', {
      wallet: wallet.publicKey,
      privatePoolHash,
    });
  }, [privatePoolHash, wallet, socket]);

  useEffect(() => {
    if (wallet.connected && privatePoolHash && socket) {
      subscribe();
    }
  }, [wallet.connected, privatePoolHash, subscribe, socket]);
};
