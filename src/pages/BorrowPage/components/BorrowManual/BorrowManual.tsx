import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find, propEq } from 'ramda';
import cx from 'classnames';

import { defaultSortValues, SortValue } from '../../hooks/useBorrowPageFilter';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import styles from './BorrowManual.module.scss';
import NoSuitableNft from '../NoSuitableNft';
import SelectedBulk from '../SelectedBulk';
import SidebarForm from '../SidebarForm';
import { useBorrowNft } from './hooks';
import SortNfts from '../SortNfts';
import Header from '../Header';
import {
  selectBulkNfts,
  selectCurrentLoanNft,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';
import { BorrowNft, BorrowNftBulk } from '@frakt/api/nft';

interface BorrowNftProps {
  onClick: () => void;
}

const BorrowManual: FC<BorrowNftProps> = ({ onClick }) => {
  const dispatch = useDispatch();

  const [sort, setSortValue] = useState<SortValue>(defaultSortValues);

  const {
    isCloseSidebar,
    nfts,
    next,
    onDeselect,
    onMultiSelect,
    selectedNfts,
    setSelectedNfts,
    connected,
    isLoading,
    searchQuery,
    setSearch,
  } = useBorrowNft({ sort });

  const perpetualNftsInfo = useSelector(selectPerpLoansNfts);
  const selectedBulkNfts = useSelector(selectBulkNfts);
  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;

  useEffect(() => {
    selectedBulkNfts.length && setSelectedNfts(selectedBulkNfts);
  }, [selectedBulkNfts, setSelectedNfts]);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const bulkNfts = useMemo(() => {
    return selectedNfts.map((nft: BorrowNftBulk) => {
      const currentNft = find(propEq('mint', nft.mint))(
        perpetualNftsInfo,
      ) as any;

      const isPriceBased = currentNft?.type === 'perpetual';
      const currentLoanValue = currentNft?.solLoanValue;
      const suggestedLoanValue = nft?.priceBased?.suggestedLoanValue;
      const maxLoanValue = nft?.timeBased?.loanValue;

      const solLoanValue =
        currentLoanValue || suggestedLoanValue || maxLoanValue;

      return {
        ...nft,
        solLoanValue: Number(solLoanValue),
        isPriceBased: currentNft?.type ? isPriceBased : nft?.isPriceBased,
      };
    });
  }, [selectedNfts, perpetualNftsInfo]);

  useEffect(() => {
    dispatch(loansActions.addPerpLoanNft(selectedNfts));
  }, [dispatch, selectedNfts]);

  const updateSelectedNft = (): void => {
    dispatch(loansActions.updatePerpLoanNft({ ...currentLoanNft }));
  };

  return (
    <AppLayout>
      {!openBulk && (
        <>
          <SidebarForm
            isCloseSidebar={isCloseSidebar}
            onDeselect={onDeselect}
            nfts={selectedNfts}
            bulkNfts={bulkNfts}
            onOpenBulk={() => {
              updateSelectedNft();
              setOpenBulk(true);
            }}
          />

          <Header
            onClick={onClick}
            title="Borrow SOL"
            subtitle={
              selectedNfts.length > 1
                ? `${selectedNfts.length} loans in bulk`
                : 'I just want to make a loan'
            }
            className={selectedNfts.length && styles.headerActive}
          />

          <SortNfts
            searchQuery={searchQuery}
            setSearch={setSearch}
            selectedNfts={selectedNfts}
            setSortValue={setSortValue}
          />

          {connected && !isLoading && !nfts.length && <NoSuitableNft />}

          {connected && (
            <InfinityScroll
              itemsToShow={nfts.length}
              next={next}
              wrapperClassName={cx(
                styles.nftsList,
                !selectedNfts.length && styles.nftListActive,
              )}
              isLoading={isLoading}
              customLoader={<p className={styles.loader}>loading your jpegs</p>}
            >
              {(nfts as BorrowNft[]).map((nft) => {
                const {
                  name,
                  imageUrl,
                  mint,
                  timeBased,
                  maxLoanValue,
                  isCanFreeze,
                } = nft;

                const isCanStake =
                  timeBased?.isCanStake || nft.priceBased?.isCanStake;

                const selected = find(propEq('mint', mint))(selectedNfts);

                const isBulk =
                  selectedNfts.length && currentLoanNft.mint === mint;

                return (
                  <NFTCheckbox
                    key={mint}
                    onClick={() => {
                      updateSelectedNft();
                      onMultiSelect(nft);
                    }}
                    imageUrl={imageUrl}
                    name={name}
                    selected={!!selected}
                    isCanStake={isCanStake}
                    isCanFreeze={isCanFreeze}
                    loanValue={maxLoanValue}
                    isBulk={isBulk}
                  />
                );
              })}
            </InfinityScroll>
          )}
        </>
      )}
      {openBulk && (
        <SelectedBulk
          onClick={() => setOpenBulk(false)}
          selectedBulk={bulkNfts}
        />
      )}
    </AppLayout>
  );
};

export default BorrowManual;
