import { Dispatch, SetStateAction, useState } from 'react';
import { BN, loans, SOL_TOKEN, web3 } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { chunk } from 'lodash';

import { commonActions } from '../../../../state/common/actions';
import { useConnection } from '../../../../hooks';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { mergeIxsIntoTxn } from '../../helpers';
import { captureSentryError } from '../../../../utils/sentry';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type UseSeletedBulkRaw = (props: { rawselectedBulk: any }) => {
  onSubmit: () => Promise<void>;
  onCardClick: (id: number) => void;
  selectedBulk: any;
  setLoadingModalVisible: Dispatch<SetStateAction<boolean>>;
  loadingModalVisible: boolean;
  getLiquidationPrice: (nft: any) => void;
  activeCardId: number;
};

const IX_PER_TXN = 3;

export const useSeletedBulkRaw: UseSeletedBulkRaw = ({ rawselectedBulk }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const dispatch = useDispatch();

  const [selectedBulk, setSelectedBulk] = useState(rawselectedBulk);

  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const [loadingModalVisible, setLoadingModalVisible] =
    useState<boolean>(false);

  const onCardClick = (id: number): void => {
    if (id === activeCardId) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
    }
  };

  const getLiquidationPrice = (nft): string => {
    const { valuation, parameters } = nft;
    const loanValue = parseFloat(valuation) * (parameters.ltvPercents / 100);

    const liquidationPrice =
      loanValue + loanValue * (parameters.collaterizationRate / 100);
    return liquidationPrice.toFixed(3);
  };

  const showConfetti = (): void => {
    dispatch(commonActions.setConfetti({ isVisible: true }));
  };

  const onSubmit = async (): Promise<void> => {
    const transactions = [];

    try {
      setLoadingModalVisible(true);
      for (let index = 0; index < selectedBulk.length; index++) {
        const {
          mint,
          valuation: rawValuation,
          parameters,
          isPriceBased,
        } = selectedBulk[index];

        const valuation = parseFloat(rawValuation);
        const proposedNftPrice = valuation * 10 ** SOL_TOKEN.decimals;

        const loanToValue = isPriceBased
          ? (parameters?.ltvPercents + 10) / 2
          : parameters?.ltvPercents;

        const { ix, loan } = await loans.proposeLoanIx({
          programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
          connection,
          user: wallet.publicKey,
          nftMint: new web3.PublicKey(mint),
          proposedNftPrice: new BN(proposedNftPrice),
          isPriceBased,
          loanToValue: new BN(loanToValue * 100),
          admin: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
        });

        transactions.push({ instructions: ix, signers: [loan] });
      }

      const ixsDataChunks = chunk(transactions, IX_PER_TXN);

      const txnData = ixsDataChunks.map((ixsAndSigners) =>
        mergeIxsIntoTxn(ixsAndSigners),
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      txnData.forEach(({ transaction }) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
      });

      const txn = await txnData.map(({ transaction, signers }) => {
        if (signers) {
          transaction.sign(...signers);
        }
        return transaction;
      });

      const signedTransactions = await wallet.signAllTransactions(txn);

      const txids = await Promise.all(
        signedTransactions.map((signedTransaction) =>
          connection.sendRawTransaction(signedTransaction.serialize()),
        ),
      );

      notify({
        message: 'Transactions sent',
        type: NotifyType.INFO,
      });

      await Promise.all(
        txids.map((txid) =>
          connection.confirmTransaction(
            { signature: txid, blockhash, lastValidBlockHeight },
            'confirmed',
          ),
        ),
      );

      notify({
        message:
          'We are collateralizing your jpegs. It should take less than a minute',
        type: NotifyType.SUCCESS,
      });

      setSelectedBulk([]);
      showConfetti();
    } catch (error) {
      const isNotConfirmed = showSolscanLinkNotification(error);

      if (!isNotConfirmed) {
        notify({
          message: 'The transaction just failed :( Give it another try',
          type: NotifyType.ERROR,
        });
      }

      captureSentryError({
        error,
        wallet,
        transactionName: 'proposeLoan',
      });
    } finally {
      setLoadingModalVisible(false);
    }
  };

  return {
    onSubmit,
    onCardClick,
    selectedBulk,
    loadingModalVisible,
    setLoadingModalVisible,
    getLiquidationPrice,
    activeCardId,
  };
};
