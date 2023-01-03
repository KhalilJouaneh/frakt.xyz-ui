import React, { useCallback, useState } from 'react';
import { web3 } from 'fbonds-core';
import { makeCreatePairTransaction } from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { useLoadingModal } from '@frakt/components/LoadingModal';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';

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
  solDeposit: number;
  solFee: number;
  handleMaxLTV: (value: number) => void;
  handleDuration: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSolDeposit: (value: string) => void;
  handleSolFee: (value: string) => void;
  onSubmit: () => Promise<void>;
  isValid: boolean;
};

export const usePoolCreation: UsePoolCreation = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();
  const wallet = useWallet();

  const [maxLTV, setMaxLTV] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [solDeposit, setSolDeposit] = useState<number>(0);
  const [solFee, setSolFee] = useState<number>(0);

  const handleMaxLTV = useCallback((value: number) => setMaxLTV(value), []);
  const handleSolFee = (value: string) => setSolFee(+value);

  const handleDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(+e.target.value);
  };

  const handleSolDeposit = (value: string) => {
    setSolDeposit(+value);
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const isValid = solDeposit && solFee !== 0;

  const onSubmit = async (): Promise<void> => {
    if (marketPubkey && wallet.publicKey) {
      try {
        openLoadingModal();
        const connection = new web3.Connection('https://api.devnet.solana.com');

        const { transaction, signers } = await makeCreatePairTransaction({
          marketPubkey: new web3.PublicKey(marketPubkey),
          maxDuration: duration,
          maxLTV: maxLTV,
          solDeposit: solDeposit,
          solFee: solFee,
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
    solFee,
    handleMaxLTV,
    handleDuration,
    handleSolDeposit,
    handleSolFee,
    onSubmit,
    isValid,
  };
};
