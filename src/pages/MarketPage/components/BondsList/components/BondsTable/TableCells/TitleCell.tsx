import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Tooltip from '@frakt/components/Tooltip';
import { ArrowDownLeft } from '@frakt/icons';
import { Bond } from '@frakt/api/bonds';

import styles from './TableCells.module.scss';
import classNames from 'classnames';

export const TitleCell: FC<{ bond: Bond; isMobile?: boolean }> = ({
  bond,
  isMobile,
}) => {
  const wallet = useWallet();
  const { collateralBox } = bond;

  const isReceiveLiquidatedNfts =
    wallet?.publicKey?.toBase58() === bond?.fbond?.bondCollateralOrSolReceiver;

  return (
    <div className={styles.fixedLeftRow}>
      <div className={styles.imageWrapper}>
        <img
          src={collateralBox?.nft?.imageUrl}
          className={classNames(styles.nftImage, {
            [styles.nftImageMobile]: isMobile,
          })}
        />
        {isReceiveLiquidatedNfts && (
          <Tooltip
            overlayClassName={styles.receiveIconTooltip}
            placement="right"
            overlay="Receive collaterized NFT instead of SOL in case of liquidation and funding a whole loan"
          >
            <div className={styles.receiveIcon}>
              <ArrowDownLeft />
            </div>
          </Tooltip>
        )}
      </div>
      <div
        className={classNames(styles.nftName, {
          [styles.nftNameMobile]: isMobile,
        })}
      >
        {collateralBox?.nft?.name}
      </div>
    </div>
  );
};
