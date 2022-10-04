import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { selectSelectedNftId } from '../../../../state/common/selectors';
import {
  selectBulkNfts,
  selectPerpLoansNfts,
} from '../../../../state/loans/selectors';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import InfinityScroll from '../../../../components/InfinityScroll';
import { SearchInput } from '../../../../components/SearchInput';
import { loansActions } from '../../../../state/loans/actions';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import { BorrowFormType } from '../BorrowForm/BorrowForm';
import styles from './BorrowNft.module.scss';
import {
  SelectLayout,
  useSelectLayout,
} from '../../../../components/SelectLayout';
import { useBorrowPage } from '../../hooks';
import SelectedBulk from '../SelectedBulk';
import BorrowForm from '../BorrowForm';
import Icons from '../../../../iconsNew';
import { commonActions } from '../../../../state/common/actions';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

interface BorrowNftProps {
  onClick: () => void;
}

export interface BorrowNftWithBulk extends BorrowNft {
  parameters?: {
    fee: string;
    ltvPercents: number;
  };
  isPriceBased?: boolean;
}

const BorrowNft: FC<BorrowNftProps> = ({ onClick }) => {
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
  } = useBorrowPage();

  const perpetualNftsInfo = useSelector(selectPerpLoansNfts);
  const selectedNftId = useSelector(selectSelectedNftId);
  const bulkNftsRaw = useSelector(selectBulkNfts);

  useEffect(() => {
    bulkNftsRaw.length && setSelectedNfts(bulkNftsRaw);
  }, [bulkNftsRaw]);

  const [openBulk, setOpenBulk] = useState<boolean>(false);

  const currentId = selectedNftId > selectedNfts.length - 1 ? 0 : selectedNftId;
  const isBulkLoan = selectedNfts.length > 1;

  const bulkNfts = selectedNfts.map((nft) => {
    if (!nft?.priceBased) {
      return { ...nft };
    } else {
      const currentNft = perpetualNftsInfo.find(
        ({ mint }) => mint === nft.mint,
      );

      const ltvPercents = currentNft?.ltv ? currentNft.ltv : 25;

      const maxLoanValuePriceBased = (
        parseFloat(nft.valuation) *
        (ltvPercents / 100)
      ).toFixed(3);

      const priceBasedFee = Number(maxLoanValuePriceBased) * 0.01;
      const isPriceBased = currentNft?.formType === BorrowFormType.PERPETUAL;

      return {
        ...nft,
        maxLoanValue: isPriceBased ? maxLoanValuePriceBased : nft?.maxLoanValue,
        priceBased: {
          ...nft.priceBased,
          fee: isPriceBased ? nft.timeBased.fee : priceBasedFee.toFixed(3),
          ltv: ltvPercents,
        },
        isPriceBased,
      } as BorrowNftWithBulk;
    }
  });

  useEffect(() => {
    if (selectedNfts.length) {
      dispatch(commonActions.setSelectedNftId({ id: selectedNfts.length - 1 }));
    }
  }, [selectedNfts]);

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
                bulkNfts.length
                  ? bulkNfts?.[currentId]
                  : selectedNfts?.[currentId]
              }
              onDeselect={onDeselect}
              isBulkLoan={isBulkLoan}
            />
          }
        >
          <div onClick={onClick} className={styles.btnBack}>
            <Icons.Arrow />
          </div>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Borrow money</h1>
              <h2 className={styles.subtitle}>
                Select your NFT to use as a collateral
              </h2>
            </div>
          </div>

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
              {(nfts as BorrowNft[]).map((nft, idx) => {
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

export default BorrowNft;
