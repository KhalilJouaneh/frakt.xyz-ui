import { FC, useState } from 'react';
import { BN, loans, SOL_TOKEN, web3 } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { chunk } from 'lodash';
import cx from 'classnames';

import { LoadingModal } from '../../../../components/LoadingModal';
import { NotifyType } from '../../../../utils/solanaUtils';
import Button from '../../../../components/Button';
import styles from './SelectedBulkRaw.module.scss';
import { useConnection } from '../../../../hooks';
import { mergeIxsIntoTxn } from '../../helpers';
import { SolanaIcon } from '../../../../icons';
import Icons from '../../../../iconsNew';
import { notify } from '../../../../utils';

interface SelectedBulkRawProps {
  selectedBulk: any;
  onClick: () => void;
  selectedBulkValue: number;
  onChangeAssetsMode: () => void;
}

const IX_PER_TXN = 3;

const SelectedBulkRaw: FC<SelectedBulkRawProps> = ({
  selectedBulk,
  onClick,
  selectedBulkValue,
  onChangeAssetsMode,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingModalVisible(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className={cx(styles.btnBack, styles.btnWithArrow)}
      >
        <Icons.Arrow />
      </div>
      <div className={styles.sidebar}>
        <p className={styles.sidebarTitle}>To borrow</p>
        <p className={styles.sidebarSubtitle}>
          {selectedBulkValue?.toFixed(2)} SOL
        </p>
        <div className={styles.sidebarBtnWrapper}>
          <Button onClick={onSubmit} type="secondary" className={styles.btn}>
            Bulk borrow {selectedBulkValue?.toFixed(2)} SOL
          </Button>
          <Button onClick={onChangeAssetsMode} className={styles.btn}>
            Change asset
          </Button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Tiltle 1</h1>
            <h2 className={styles.subtitle}>
              {selectedBulk?.length} loans in bulk
            </h2>
          </div>
        </div>

        {selectedBulk.map((nft, id) => (
          <div className={styles.cardWrapper} key={id}>
            <div className={styles.card}>
              <div className={styles.cardInfo}>
                <img className={styles.image} src={nft?.imageUrl} />
                <div className={styles.name}>{nft?.name || ''}</div>
              </div>
              <div className={styles.cardValues}>
                {getStatsValue({
                  title: 'To borrow',
                  value: nft?.maxLoanValue,
                  withIcon: true,
                  className: styles.rowCardValue,
                })}
                <div
                  onClick={() => onCardClick(id)}
                  className={cx(
                    activeCardId === id && styles.btnVisible,
                    styles.btnWithArrow,
                  )}
                >
                  <Icons.Chevron />
                </div>
              </div>
            </div>
            {id === activeCardId && (
              <div className={styles.hiddenValues}>
                {getStatsValue({
                  title: 'Loan Type',
                  value: nft?.isPriceBased ? 'Perpetual' : 'Flip',
                })}
                {getStatsValue({
                  title: 'Loan to value',
                  value: `${nft?.parameters?.ltvPercents} %`,
                })}
                {getStatsValue({
                  title: 'Floor price',
                  value: `${nft?.valuation}`,
                  withIcon: true,
                })}
                {nft?.isPriceBased &&
                  getStatsValue({
                    title: 'Liquidations price',
                    value: `${getLiquidationPrice(nft)}`,
                    withIcon: true,
                  })}
                {nft?.isPriceBased &&
                  getStatsValue({
                    title: 'Borrow APY',
                    value: `${nft?.parameters?.borrowAPRPercents?.toFixed(
                      0,
                    )} %`,
                  })}
                {getStatsValue({
                  title: 'Minting fee',
                  value: `${nft?.parameters?.fee}`,
                  withIcon: true,
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={() => setLoadingModalVisible(false)}
      />
    </>
  );
};

export default SelectedBulkRaw;

const getStatsValue = ({
  title,
  value,
  withIcon,
  className,
}: {
  title: string;
  value: number | string;
  withIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className={cx(styles.cardValue, className)}>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardSubtitle}>
        {value} {withIcon && <SolanaIcon />}
      </p>
    </div>
  );
};
