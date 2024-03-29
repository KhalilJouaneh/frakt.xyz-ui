import { web3 } from '@frakt-protocol/frakt-sdk';
import { Socket } from 'socket.io-client';

export interface NotificationState {
  config?: { mode: 'error' | 'warning'; content: JSX.Element };
  isVisible: boolean;
}

export interface SolanaHealthResponse {
  submitted: number;
  confirmed: number;
  loss: string;
  mean_ms: number;
  ts: string;
}

export enum SolanaNetworkHealth {
  Down = 'Down',
  Slow = 'Slow',
  Good = 'Good',
}

export interface SolanaHealthState {
  health: SolanaNetworkHealth;
  loss: number;
}

export interface ConnectionState {
  connection: web3.Connection;
}

export interface SocketState {
  socket: Socket;
}

export interface WalletState {
  wallet: {
    publicKey: web3.PublicKey | null;
  };
}

export interface WalletModalState {
  isVisible: boolean;
}

export interface ModalState {
  isVisible: boolean;
}

export interface ConfettiState {
  isVisible: boolean;
}

export interface SelectedNftIdState {
  id: number;
}
