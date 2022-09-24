import { FC, useEffect, useState } from 'react';
import { sum, map } from 'ramda';
import cx from 'classnames';

import { useSelectLayout } from '../../../../components/SelectLayout';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import Button from '../../../../components/Button';
import SelectedBulkRaw from '../SelectedBulkRaw';
import styles from './SelectedBulk.module.scss';
import Icons from '../../../../iconsNew';

interface BorrowingBulkProps {
  selectedBulk: any;
  onClick?: () => void;
}

const SelectedBulk: FC<BorrowingBulkProps> = ({
  selectedBulk: rawselectedBulk,
  onClick,
}) => {
  const [selectedBulk, setSelectedBulk] = useState(rawselectedBulk);
  const [isAssetsMode, setIsAssetsMode] = useState<boolean>(false);
  const [borrowedValue, setBorrowedValue] = useState<number>(0);
  const [removedNft, setRemovedNft] = useState<BorrowNft[]>([]);

  const { onMultiSelect, selectedNfts, setSelectedNfts } = useSelectLayout();

  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
  const selectedBulkValue = sum(map(maxLoanValue, selectedBulk));

  const isDisabled = selectedBulk.length === selectedNfts.length;

  useEffect(() => {
    setRemovedNft(
      selectedBulk.filter(
        (selectedBulkMint) =>
          !selectedNfts.find(
            (selectedNftMint) => selectedNftMint.mint === selectedBulkMint.mint,
          ),
      ),
    );
  }, [selectedNfts]);

  useEffect(() => {
    const borrowValueSelectedNft = sum(map(maxLoanValue, selectedNfts));
    setBorrowedValue(selectedBulkValue - borrowValueSelectedNft);
  }, [selectedNfts]);

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
