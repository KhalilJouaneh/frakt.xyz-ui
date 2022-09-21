import { FC, useState } from 'react';
import cx from 'classnames';

import styles from './SelectedBulk.module.scss';
import { SolanaIcon } from '../../../../icons';
import Icons from '../../../../iconsNew';
import Button from '../../../../components/Button';

interface BorrowingBulkProps {
  selectedBulk: any;
  onClick: () => void;
}

const SelectedBulk: FC<BorrowingBulkProps> = ({ selectedBulk, onClick }) => {
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const onCardClick = (id: number): void => {
    if (id === activeCardId) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
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
        <p className={styles.sidebarSubtitle}>11.03 SOL</p>
        <div className={styles.sidebarBtnWrapper}>
          <Button type="secondary" className={styles.btn}>
            Bulk borrow 11.03 SOL
          </Button>
          <Button className={styles.btn}>Change asset</Button>
        </div>
      </div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tiltle 1</h1>
          <h2 className={styles.subtitle}>
            {selectedBulk?.length} loans in bulk
          </h2>
        </div>
      </div>
      <div className={styles.container}>
        {selectedBulk.map((item, id) => (
          <div className={styles.cardWrapper} key={id}>
            <div className={styles.card}>
              <div className={styles.cardInfo}>
                <img className={styles.image} src={item?.imageUrl} />
                <div className={styles.name}>{item?.name || ''}</div>
              </div>
              <div className={styles.cardValues}>
                <div
                  className={styles.cardValue}
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <p className={styles.cardTitle}>To borrow</p>
                  <p className={styles.cardSubtitle}>
                    {item?.maxLoanValue} <SolanaIcon />
                  </p>
                </div>
                <div
                  onClick={() => onCardClick(id)}
                  className={cx(styles.btnVisible, styles.btnWithArrow)}
                >
                  <Icons.Arrow />
                </div>
              </div>
            </div>
            {id === activeCardId && (
              <div className={styles.hiddenValues}>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Loan Type</p>
                  <p className={styles.cardSubtitle}>
                    {item?.isPriceBased ? 'Perpetual' : 'Flip'}
                  </p>
                </div>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Loan to value</p>
                  <p className={styles.cardSubtitle}>{item?.maxLoanValue} %</p>
                </div>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Floor price</p>
                  <p className={styles.cardSubtitle}>
                    {item?.valuation} <SolanaIcon />
                  </p>
                </div>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Liquidations price</p>
                  <p className={styles.cardSubtitle}>
                    {item?.maxLoanValue} <SolanaIcon />
                  </p>
                </div>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Borrow APY</p>
                  <p className={styles.cardSubtitle}>
                    {item?.maxLoanValue} <SolanaIcon />
                  </p>
                </div>
                <div className={styles.cardValue}>
                  <p className={styles.cardTitle}>Minting fee</p>
                  <p className={styles.cardSubtitle}>
                    {item?.parameters?.fee} <SolanaIcon />
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SelectedBulk;
