import React, { useCallback, useState } from 'react';
import { web3 } from 'fbonds-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import {
  makeCreatePairTransaction,
  // makeRemoveOrderTransaction,
  useMarket,
} from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { useConnection } from '@frakt/hooks';
import { useNativeAccount } from '@frakt/utils/accounts';

export const useOfferPage = () => {
  const history = useHistory();
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();

  const { account } = useNativeAccount();
  const { market, isLoading } = useMarket({
    marketPubkey,
  });

  const wallet = useWallet();
  const connection = useConnection();

  const [ltv, setLtv] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<string>('0');
  const [offerSize, setOfferSize] = useState<string>('0');

  const onLtvChange = useCallback((value: number) => setLtv(value), []);
  const onDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(+event.target.value);
  };

  const onInterestChange = (value: string) => setInterest(value);
  const onOfferSizeChange = (value: string) => {
    setOfferSize(value);
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const goBack = () => {
    history.goBack();
  };

  const isValid = Number(offerSize) && Number(interest) !== 0;

  const onCreateOffer = async () => {
    if (marketPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers } = await makeCreatePairTransaction({
          marketPubkey: new web3.PublicKey(marketPubkey),
          maxDuration: duration,
          maxLTV: ltv,
          solDeposit: parseFloat(offerSize),
          apr: parseFloat(interest),
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

  const onEditOffer = async () => {
    if (marketPubkey && pairPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        await new Promise((res) => res);

        // const { transaction, signers } = await makeCreatePairTransaction({
        //   marketPubkey: new web3.PublicKey(marketPubkey),
        //   maxDuration: duration,
        //   maxLTV: ltv,
        //   solDeposit: parseFloat(offerSize),
        //   apr: parseFloat(interest),
        //   connection,
        //   wallet,
        // });

        // await signAndConfirmTransaction({
        //   transaction,
        //   signers,
        //   wallet,
        //   connection,
        // });

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

  const onRemoveOffer = async () => {
    if (marketPubkey && pairPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        await new Promise((res) => res);

        // const { transaction, signers } = await makeRemoveOrderTransaction({
        //   pairPubkey: new web3.PublicKey(order.rawData.publicKey),
        //   authorityAdapter: new web3.PublicKey(order.rawData.authorityAdapter),
        //   edgeSettlement: order.rawData.edgeSettlement,
        //   wallet,
        //   connection,
        // });

        // await signAndConfirmTransaction({
        //   connection,
        //   transaction,
        //   signers,
        //   wallet,
        // });

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs?.join('\n'));
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
    ltv,
    duration,
    offerSize,
    interest,
    onLtvChange,
    onDurationChange,
    onOfferSizeChange,
    onInterestChange,
    onCreateOffer,
    onEditOffer,
    onRemoveOffer,
    isValid,
    isEdit: !!pairPubkey,
    goBack,
    walletSolBalance: account?.lamports ?? 0,
    market,
    isLoading,
  };
};
