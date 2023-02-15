import { useCallback, useState } from 'react';
import { web3 } from 'fbonds-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { useHistory, useParams } from 'react-router-dom';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { useQueryClient } from '@tanstack/react-query';

import { useLoadingModal } from '@frakt/components/LoadingModal';
import {
  getPairAccount,
  makeCreatePairTransaction,
  makeRemoveOrderTransaction,
  useMarket,
  useMarketPair,
} from '@frakt/utils/bonds';
import { signAndConfirmTransaction } from '@frakt/utils/transactions';
import { notify } from '@frakt/utils';
import { NotifyType } from '@frakt/utils/solanaUtils';
import { useConnection } from '@frakt/hooks';
import { useNativeAccount } from '@frakt/utils/accounts';
import { PATHS } from '@frakt/constants';
import { Pair } from '@frakt/api/bonds';

import { RBOption } from './components/RadioButton';

export const useOfferPage = () => {
  const history = useHistory();
  const { marketPubkey, pairPubkey } = useParams<{
    marketPubkey: string;
    pairPubkey: string;
  }>();

  const { account } = useNativeAccount();
  const { market, isLoading: marketLoading } = useMarket({
    marketPubkey,
  });

  const { pair, isLoading: pairLoading } = useMarketPair({
    pairPubkey,
  });

  const queryClient = useQueryClient();

  const wallet = useWallet();
  const connection = useConnection();

  const [ltv, setLtv] = useState<number>(10);
  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<string>('0');
  const [offerSize, setOfferSize] = useState<string>('0');
  const [autocompound, setAutocompound] = useState(false);
  const [receiveLiquidatedNfts, setReceiveLiquidatedNfts] = useState(false);

  const onLtvChange = useCallback((value: number) => setLtv(value), []);
  const onDurationChange = (nextOption: RBOption<number>) => {
    setDuration(nextOption.value);
  };

  const onInterestChange = (value: string) => setInterest(value);
  const onOfferSizeChange = (value: string) => {
    setOfferSize(value);
  };
  const toggleAutocompound = () => {
    setAutocompound((prev) => !prev);
  };
  const toggleReceiveLiquidatedNfts = () => {
    setReceiveLiquidatedNfts((prev) => !prev);
  };

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const goBack = () => {
    history.goBack();
  };

  const isValid =
    Number(offerSize) && Number(interest) !== 0 && wallet.connected;

  const onCreateOffer = async () => {
    if (marketPubkey && wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers, accountsPublicKeys } =
          await makeCreatePairTransaction({
            marketPubkey: new web3.PublicKey(marketPubkey),
            maxDuration: duration,
            maxLTV: ltv,
            solDeposit: parseFloat(offerSize),
            interest: parseFloat(interest),
            bondFeature: receiveLiquidatedNfts
              ? BondFeatures.ReceiveNftOnLiquidation
              : BondFeatures.None,
            connection,
            wallet,
          });

        await signAndConfirmTransaction({
          transaction,
          signers,
          wallet,
          connection,
        });

        const newPair = await getPairAccount({
          accountsPublicKeys,
          connection,
        });

        newPair &&
          queryClient.setQueryData(
            ['marketPairs', marketPubkey],
            (pairs: Pair[]) => {
              return [...pairs, newPair];
            },
          );

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.BOND}/${marketPubkey}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error?.logs);
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
    if (marketPubkey && pair && wallet.publicKey) {
      try {
        openLoadingModal();

        const { transaction, signers } = await makeRemoveOrderTransaction({
          pairPubkey: new web3.PublicKey(pair.publicKey),
          authorityAdapter: new web3.PublicKey(pair.authorityAdapterPublicKey),
          edgeSettlement: pair.edgeSettlement,
          wallet,
          connection,
        });

        await signAndConfirmTransaction({
          connection,
          transaction,
          signers,
          wallet,
        });

        notify({
          message: 'Transaction successful!',
          type: NotifyType.SUCCESS,
        });

        history.push(`${PATHS.BOND}/${marketPubkey}`);
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

  const isLoading = pairPubkey ? pairLoading || marketLoading : marketLoading;

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
    autocompound,
    toggleAutocompound,
    receiveLiquidatedNfts,
    toggleReceiveLiquidatedNfts,
  };
};
