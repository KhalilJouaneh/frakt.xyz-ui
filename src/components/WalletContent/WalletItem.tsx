import { FC } from 'react';
import Icons from '../../iconsNew/';
import styles from './styles.module.scss';

interface WalletItemProps {
  onClick: () => void;
  imageSrc: string;
  imageAlt: string;
  name: string;
}

export const WalletItem: FC<WalletItemProps> = ({
  onClick,
  imageSrc,
  imageAlt,
  name,
}) => {
  return (
    <div className={styles.walletItemContainer}>
      <div className={styles.walletItem} onClick={onClick}>
        {name === 'Ledger' && <Icons.Ledger className={styles.icon} />}
        {name === 'MathWallet' && <Icons.MathWallet className={styles.icon} />}
        {name !== 'Ledger' && name !== 'MathWallet' && (
          <img alt={imageAlt} src={imageSrc} />
        )}
        {name}
      </div>
    </div>
  );
};
