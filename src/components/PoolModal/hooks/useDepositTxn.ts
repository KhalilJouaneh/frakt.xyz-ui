import { useConnection } from '@frakt/hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  depositLiquidity as depositTxn,
  unstakeLiquidity as unstakeTxn,
} from '@frakt/utils/loans';

type UseDepositTxn = ({
  onCancel,
  liquidityPoolPubkey,
  depositValue,
  withdrawValue,
  onClearDepositValue,
}: {
  depositValue?: string;
  withdrawValue?: string;
  onCancel: () => void;
  liquidityPoolPubkey: string;
  onClearDepositValue?: () => void;
}) => {
  depositLiquidity: () => void;
  unstakeLiquidity: () => void;
};

export const useDepositTxn: UseDepositTxn = ({
  depositValue,
  withdrawValue,
  onCancel,
  liquidityPoolPubkey,
  onClearDepositValue,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const depositLiquidity = async (): Promise<void> => {
    const amount = Number(depositValue) * 1e9;

    await depositTxn({
      onAfterSend: onClearDepositValue,
      connection,
      wallet,
      liquidityPool: liquidityPoolPubkey,
      amount,
    });

    onCancel();
  };

  const unstakeLiquidity = async (): Promise<void> => {
    const amount = Number(withdrawValue) * 1e9;

    await unstakeTxn({
      onAfterSend: onClearDepositValue,
      connection,
      wallet,
      liquidityPool: liquidityPoolPubkey,
      amount,
    });

    onCancel();
  };

  return { depositLiquidity, unstakeLiquidity };
};
