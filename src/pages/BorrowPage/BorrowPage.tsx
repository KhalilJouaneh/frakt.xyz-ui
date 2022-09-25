import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { LinkWithArrow } from '../../components/LinkWithArrow';
import InfinityScroll from '../../components/InfinityScroll';
import { SearchInput } from '../../components/SearchInput';
import { commonActions } from '../../state/common/actions';
import { sendAmplitudeData } from '../../utils/amplitude';
import NFTCheckbox from '../../components/NFTCheckbox';
import { BorrowForm } from './components/BorrowForm';
import { BorrowNft } from '../../state/loans/types';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { useBorrowPage } from './hooks';
import classNames from 'classnames';
import { ConnectWalletSection } from '../../components/ConnectWalletSection';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowPage: FC = () => {
  const dispatch = useDispatch();
  const { connected, onDeselect, onSelect, selectedNfts } = useSelectLayout();

  const {
    isCloseSidebar,
    nfts,
    setSearch,
    searchItems,
    search,
    next,
    loading,
  } = useBorrowPage();

  return (
    <SelectLayout
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      isCloseSidebar={isCloseSidebar}
      sidebarForm={
        <BorrowForm selectedNft={selectedNfts?.[0]} onDeselect={onDeselect} />
      }
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Borrow money</h1>
          <h2 className={styles.subtitle}>
            Select your NFT to use as a collateral
          </h2>
        </div>
      </div>

      {connected && (
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
      )}

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

      {connected ? (
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
                onClick={() => onSelect(nft)}
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
      ) : (
        <ConnectWalletSection text="Connect your wallet to check if you have any active loans" />
      )}
    </SelectLayout>
  );
};

export default BorrowPage;
