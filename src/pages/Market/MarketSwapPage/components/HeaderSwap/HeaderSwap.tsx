import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { MarketNavigation } from '../../../components/MarketNavigation';
import { SolanaIcon } from '../../../../../icons';
import { useHeaderState } from '../../../../../components/Layout/headerState';

interface HeaderSwapProps {
  poolPublicKey: string;
}

export const HeaderSwap: FC<HeaderSwapProps> = ({ poolPublicKey }) => {
  const { isHeaderHidden } = useHeaderState();
  return (
    <div
      className={classNames({
        [styles.positionWrapper]: true,
        [styles.headerHidden]: isHeaderHidden,
      })}
    >
      <div className={`container ${styles.container}`}>
        <div className={styles.wrapper}>
          <div className={styles.headerWrapper}>
            <div className={styles.sellInfoWrapper}>
              <p className={styles.sellInfoItem}>
                {0.002124} <SolanaIcon /> SOL
              </p>
              <div className={styles.separator} />
              <p className={styles.sellInfoItem}>
                {0.002124}
                <span
                  className={styles.infoImage}
                  style={{ backgroundImage: `url(${'/'})` }}
                />
                {'PUNKS'}
              </p>
            </div>
            <MarketNavigation
              className={styles.marketNavigation}
              poolPublicKey={poolPublicKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
};