import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { SearchInput } from '../../../../components/SearchInput';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import { BorrowFormType } from '../BorrowForm/BorrowForm';
import styles from './BorrowManual.module.scss';
import NoSuitableNft from '../NoSuitableNft';
import SelectedBulk from '../SelectedBulk';
import { BulkValues } from '../../hooks';
import SidebarForm from '../SidebarForm';
import { useBorrowNft } from './hooks';
import Header from '../Header';
import {
  selectBulkNfts,
  selectCurrentLoanNft,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';

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
  const selectedBulkNfts = useSelector(selectBulkNfts);
  const currentLoanNft = useSelector(selectCurrentLoanNft) as any;

  useEffect(() => {
    selectedBulkNfts.length && setSelectedNfts(selectedBulkNfts);
  }, [selectedBulkNfts]);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const bulkNfts = useMemo(() => {
    return selectedNfts.map((nft: BulkValues) => {
      if (!nft?.priceBased) return { ...nft };

      const { valuation, timeBased, priceBased } = nft;

      const currentNft = perpetualNftsInfo.find(
        ({ mint }) => mint === nft?.mint,
      );

      const valuationNumber = parseFloat(valuation);

      const suggestedLtv = parseFloat(
        ((priceBased.suggestedLoanValue / valuationNumber) * 100).toFixed(0),
      );

      const ltvPercent: number = currentNft?.ltv || suggestedLtv || 25;
      const ltvValue = ltvPercent / 100;

      const maxLoanValuePriceBased = valuationNumber * ltvValue;

      const isPriceBased = currentNft?.formType === BorrowFormType.PERPETUAL;

      const maxLoanValue = isPriceBased
        ? maxLoanValuePriceBased.toFixed(3)
        : timeBased?.loanValue;

      return {
        ...nft,
        maxLoanValue,
        priceBased: { ...priceBased, ltv: ltvPercent },
        isPriceBased: currentNft?.formType ? isPriceBased : nft?.isPriceBased,
      };
    });
  }, [selectedNfts, perpetualNftsInfo]);

  const allPerpetualLoans = selectedNfts.filter(({ priceBased }) => priceBased);

  useEffect(() => {
    dispatch(loansActions.addPerpLoanNft(allPerpetualLoans));
  }, [dispatch]);

  const updateSelectedNft = (): void => {
    const params = {
      mint: currentLoanNft?.mint,
      ltv: currentLoanNft.ltv,
      formType: currentLoanNft.type,
    };

    dispatch(loansActions.updatePerpLoanNft(params));
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

                const selected = !!selectedNfts.find(
                  (selectedNft) => selectedNft?.mint === nft.mint,
                );

                return (
                  <NFTCheckbox
                    key={mint}
                    onClick={() => {
                      updateSelectedNft();
                      onMultiSelect(nft);
                    }}
                    imageUrl={imageUrl}
                    name={name}
                    selected={selected}
                    isCanStake={isCanStake}
                    isCanFreeze={isCanFreeze}
                    loanValue={maxLoanValue}
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
