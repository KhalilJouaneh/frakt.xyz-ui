import { FC } from 'react';
import cx from 'classnames';

import NFTCheckbox from '../../../../components/NFTCheckbox';
import Button from '../../../../components/Button';
import SelectedBulkRaw from '../SelectedBulkRaw';
import styles from './SelectedBulk.module.scss';
import { BulkValues } from '../../BorrowPage';
import { useSeletedBulk } from './hooks';
import Icons from '../../../../iconsNew';

interface BorrowingBulkProps {
  selectedBulk: any[];
  onClick?: () => void;
}

const SelectedBulk: FC<BorrowingBulkProps> = ({
  selectedBulk: rawselectedBulk,
  onClick,
}) => {
  const {
    isAssetsMode,
    setIsAssetsMode,
    borrowedValue,
    removedNft,
    isDisabled,
    setSelectedBulk,
    selectedBulk,
    selectedNfts,
    selectedBulkValue,
    onMultiSelect,
    setSelectedNfts,
  } = useSeletedBulk({ rawselectedBulk });

  return (
    <>
      {!isAssetsMode ? (
        <SelectedBulkRaw
          onClick={onClick}
          onChangeAssetsMode={() => setIsAssetsMode(true)}
          selectedBulk={selectedBulk}
          selectedBulkValue={selectedBulkValue}
        />
      ) : (
        <>
          <div
            onClick={() => setIsAssetsMode(false)}
            className={cx(styles.btnBack, styles.btnWithArrow)}
          >
            <Icons.Arrow />
          </div>
          <div className={styles.sidebar}>
            <p className={styles.sidebarTitle}>To borrow</p>
            <p className={styles.sidebarSubtitle}>
              {borrowedValue?.toFixed(2)} SOL
            </p>
            <div className={styles.sidebarBtnWrapper}>
              <Button
                onClick={() => {
                  setIsAssetsMode(false);
                  setSelectedBulk(removedNft);
                  setSelectedNfts([]);
                }}
                type="secondary"
                className={styles.btn}
                disabled={isDisabled}
              >
                View bulk loan
              </Button>
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
          <div className={styles.nftsList}>
            {selectedBulk.map((nft) => (
              <NFTCheckbox
                key={nft.mint}
                name={nft.name}
                onClick={() => onMultiSelect(nft)}
                imageUrl={nft.imageUrl}
                selected={
                  !!selectedNfts.find(
                    (selectedNft) => selectedNft?.mint === nft.mint,
                  )
                }
                isCanStake={
                  nft.timeBased?.isCanStake || nft.priceBased?.isCanStake
                }
                isCanFreeze={nft.isCanFreeze}
                loanValue={nft?.maxLoanValue}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SelectedBulk;
