import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import {
  selectBulkNfts,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { SearchInput } from '../../../../components/SearchInput';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import styles from './BorrowManual.module.scss';

import SelectedBulk from '../SelectedBulk';
import { BorrowFormType } from '../BorrowForm/BorrowForm';
import Header from '../Header';
import { useBorrowNft } from './hooks';
import { BulkValues } from '../../hooks';
import SidebarForm from '../SidebarForm';
import NoSuitableNft from '../NoSuitableNft';

interface BorrowNftProps {
  onClick: () => void;
}

const BorrowManual: FC<BorrowNftProps> = ({ onClick }) => {
  const dispatch = useDispatch();

  const {
    isCloseSidebar,
    nfts,
    setSearch,
    searchItems,
    search,
    next,
    loading,
    onDeselect,
    onMultiSelect,
    selectedNfts,
    setSelectedNfts,
    connected,
  } = useBorrowNft();

  const perpetualNftsInfo = useSelector(selectPerpLoansNfts);
  const bulkNftsRaw = useSelector(selectBulkNfts);

  useEffect(() => {
    bulkNftsRaw.length && setSelectedNfts(bulkNftsRaw);
  }, [bulkNftsRaw]);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const bulkNfts = useMemo(() => {
    return selectedNfts.map((nft: BulkValues) => {
      if (!nft?.priceBased) {
        return { ...nft };
      } else {
        const { valuation, timeBased, priceBased } = nft;

        const currentNft = perpetualNftsInfo.find(
          ({ mint }) => mint === nft?.mint,
        );

        const valuationNumber = parseFloat(valuation);

        const suggestedLtv = Number(
          ((priceBased.suggestedLoanValue / valuationNumber) * 100).toFixed(0),
        );

        const ltvPercent: number = currentNft?.ltv || suggestedLtv || 25;
        const ltvValue = ltvPercent / 100;

        const maxLoanValuePriceBased = valuationNumber * ltvValue;

        const isPriceBased = currentNft?.formType === BorrowFormType.PERPETUAL;

        const maxLoanValue = isPriceBased
          ? maxLoanValuePriceBased.toFixed(3)
          : timeBased?.loanValue;

        const priceBasedFee = maxLoanValuePriceBased * 0.01;
        const fee = isPriceBased ? timeBased.fee : priceBasedFee.toFixed(3);

        return {
          ...nft,
          maxLoanValue,
          priceBased: { ...priceBased, fee, ltv: ltvPercent },
          isPriceBased: currentNft?.formType
            ? isPriceBased
            : (nft as any)?.isPriceBased,
        };
      }
    });
  }, [selectedNfts, perpetualNftsInfo]);

  const allPerpetualLoans = selectedNfts.filter(({ priceBased }) => priceBased);

  useEffect(() => {
    dispatch(loansActions.addPerpLoanNft(allPerpetualLoans));
  }, [dispatch]);

  return (
    <AppLayout>
      {!openBulk && (
        <>
          <SidebarForm
            isCloseSidebar={isCloseSidebar}
            onDeselect={onDeselect}
            nfts={selectedNfts}
            bulkNfts={bulkNfts}
            onOpenBulk={() => setOpenBulk(true)}
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

          <div className={styles.sortWrapper}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value || '');
                searchItems(e.target.value || '');
              }}
              className={styles.searchInput}
              placeholder="Search by name"
            />
          </div>

          {connected && !loading && !nfts.length && <NoSuitableNft />}

          {connected && (
            <InfinityScroll
              itemsToShow={nfts.length}
              next={next}
              wrapperClassName={classNames(
                styles.nftsList,
                !selectedNfts.length && styles.nftListActive,
              )}
              isLoading={loading}
              emptyMessage=""
              customLoader={<p className={styles.loader}>loading your jpegs</p>}
            >
              {(nfts as BorrowNft[]).map((nft) => {
                return (
                  <NFTCheckbox
                    key={nft.mint}
                    onClick={() => onMultiSelect(nft)}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    selected={
                      !!selectedNfts.find(
                        (selectedNft) => selectedNft?.mint === nft.mint,
                      )
                    }
                    isCanStake={
                      nft.timeBased?.isCanStake || nft.priceBased?.isCanStake
                    }
                    isCanFreeze={nft.isCanFreeze}
                    loanValue={nft.maxLoanValue}
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
