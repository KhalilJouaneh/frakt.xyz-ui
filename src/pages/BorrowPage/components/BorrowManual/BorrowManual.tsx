import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import {
  selectBulkNfts,
  selectCurrentNft,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { SearchInput } from '../../../../components/SearchInput';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import styles from './BorrowManual.module.scss';
import {
  SelectLayout,
  useSelectLayout,
} from '../../../../components/SelectLayout';
import SelectedBulk from '../SelectedBulk';
import BorrowForm from '../BorrowForm';
import { BorrowFormType } from '../BorrowForm/BorrowForm';
import Header from '../Header';
import { useBorrowNft } from './hooks';
import { BulkValues } from '../../hooks';
import { commonActions } from '../../../../state/common/actions';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

interface BorrowNftProps {
  onClick: () => void;
}

const BorrowManual: FC<BorrowNftProps> = ({ onClick }) => {
  const dispatch = useDispatch();
  const {
    connected,
    onDeselect,
    onMultiSelect,
    selectedNfts,
    setSelectedNfts,
  } = useSelectLayout();

  const {
    isCloseSidebar,
    nfts,
    setSearch,
    searchItems,
    search,
    next,
    loading,
  } = useBorrowNft();

  const perpetualNftsInfo = useSelector(selectPerpLoansNfts);
  const selectedNftId = useSelector(selectSelectedNftId);
  const bulkNftsRaw = useSelector(selectBulkNfts);

  useEffect(() => {
    bulkNftsRaw.length && setSelectedNfts(bulkNftsRaw);
  }, [bulkNftsRaw]);

  useEffect(() => {
    if (selectedNfts.length) {
      dispatch(commonActions.setSelectedNftId(selectedNfts.length - 1));
    }
  }, [selectedNfts]);

  const currentNft = useSelector(selectCurrentNft);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const currentId = selectedNftId > selectedNfts.length - 1 ? 0 : selectedNftId;
  const isBulkLoan = selectedNfts.length > 1;

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
          isPriceBased: currentNft?.formType ? isPriceBased : true,
        };
      }
    });
  }, [selectedNfts, perpetualNftsInfo]);

  const allPerpetualLoans = selectedNfts.filter(({ priceBased }) => priceBased);

  useEffect(() => {
    dispatch(loansActions.addPerpLoanNft(allPerpetualLoans));
  }, [dispatch]);

  return (
    <>
      {!openBulk && (
        <SelectLayout
          selectedNfts={selectedNfts}
          onDeselect={onDeselect}
          isCloseSidebar={isCloseSidebar}
          sidebarForm={
            <BorrowForm
              onClick={() => setOpenBulk(true)}
              selectedNft={
                (currentNft as any)?.name
                  ? (currentNft as any)
                  : bulkNfts?.[currentId]
              }
              onDeselect={onDeselect}
              isBulkLoan={isBulkLoan}
            />
          }
        >
          <Header
            onClick={onClick}
            title="Borrow SOL"
            subtitle="Select your NFT to use as a collateral"
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

          {connected && !loading && !nfts.length && (
            <div className={styles.noSuiableMessageWrapper}>
              <p className={styles.noSuiableMessage}>No suitable NFTs found</p>
              <LinkWithArrow
                className={styles.acceptedCollectionsLink}
                label="Check collections accepted for loans"
                to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
                externalLink
              />
            </div>
          )}

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
        </SelectLayout>
      )}
      {openBulk && (
        <AppLayout>
          <SelectedBulk
            onClick={() => setOpenBulk(false)}
            selectedBulk={bulkNfts}
          />
        </AppLayout>
      )}
    </>
  );
};

export default BorrowManual;
