import React, { useCallback, useState } from 'react';
import { web3 } from 'fbonds-core';
import { makeCreatePairTransaction } from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { useConnection } from '@frakt/hooks';

export const riskMarks: { [key: string]: string | JSX.Element } = {
  10: '10%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

type UsePoolCreation = () => {
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  maxLTV: number;
  duration: number;
  solDeposit: string;
  apr: string;
  onAprChange: (value: string) => void;
  handleMaxLTV: (value: number) => void;
  handleSolDeposit: (value: string) => void;
  handleDuration: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  isValid: boolean;
};

export const usePoolCreation: UsePoolCreation = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const wallet = useWallet();
  const connection = useConnection();

  const [maxLTV, setMaxLTV] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [apr, setApr] = useState<string>('0');
  const [solDeposit, setSolDeposit] = useState<string>('0');

  const handleMaxLTV = useCallback((value: number) => setMaxLTV(value), []);
  const handleDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(+e.target.value);
  };

  const onAprChange = (value: string) => setApr(value);
  const handleSolDeposit = (value: string) => {
    setSolDeposit(value);
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const isValid = Number(solDeposit) && Number(apr) !== 0;

  const onSubmit = async (): Promise<void> => {
    if (marketPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers } = await makeCreatePairTransaction({
          marketPubkey: new web3.PublicKey(marketPubkey),
          maxDuration: duration,
          maxLTV: maxLTV,
          solDeposit: parseFloat(solDeposit),
          apr: parseFloat(apr),
          connection,
          wallet,
        });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });
      } catch (error) {
        console.error(error);

        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      } finally {
        closeLoadingModal();
      }
    }
  };

  return {
    loadingModalVisible,
    closeLoadingModal,
    maxLTV,
    duration,
    solDeposit,
    apr,
    handleMaxLTV,
    handleDuration,
    handleSolDeposit,
    onAprChange,
    onSubmit,
    isValid,
  };
};
