import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { selectTxLiquidateStatus } from '../../../../state/liquidations/selectors';
import { liquidationsActions } from '../../../../state/liquidations/actions';
import { useOnFulfilled } from '../../../../hooks';
import styles from './WonRaffleCard.module.scss';

const WonRaffleCard: FC<{ data }> = ({ data }) => {
  const [tryId, setTryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const txRequestStatus = useSelector(selectTxLiquidateStatus);
  useOnFulfilled(txRequestStatus, () => {
    setIsLoading(false);
  });

  const handleSumit = () => {
    setTryId(null);
    setIsLoading(true);
    dispatch(liquidationsActions.txLiquidate(data));
  };

  const isWinner = true;

  return (
    <div className={styles.cardWrapper}>
      <div className={cx(styles.card, isWinner && styles.cardWinner)}>
        <div className={styles.nftInfo}>
          <img className={styles.nftImage} src={data.nftImageUrl} />
          <p className={styles.nftName}>{data.nftName}</p>
        </div>
        <div className={styles.statsValue}>
          <div className={cx(styles.totalValue, styles.opacity)}>
            <p className={styles.subtitle}>Floor price</p>
            <p className={styles.value}>{`${data.nftFloorPrice} SOL`}</p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>liquidation price</p>
            <p
              className={styles.value}
            >{`${data.paybackPriceWithGrace} SOL`}</p>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>Winner</p>
            <div className={styles.winner}>
              <div className={styles.winnerBadge}>You!</div>
              <p className={styles.value}>H2aF...WrnH</p>
            </div>
          </div>
          <div className={styles.totalValue}>
            <p className={styles.subtitle}>Ended</p>
            <p className={styles.value}>8 min ago</p>
          </div>
        </div>
      </div>
      <ConfirmModal
        visible={tryId}
        onCancel={() => setTryId(null)}
        onSubmit={handleSumit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to liquidate and aquire ${data.nftName}`}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={isLoading}
        onCancel={() => setIsLoading(false)}
      />
    </div>
  );
};

export default WonRaffleCard;
