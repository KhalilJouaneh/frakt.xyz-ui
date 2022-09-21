import { FC } from 'react';
import { useDispatch } from 'react-redux';

import InfinityScroll from '../../../../components/InfinityScroll';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { commonActions } from '../../../../state/common/actions';
import { SearchInput } from '../../../../components/SearchInput';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import NFTCheckbox from '../../../../components/NFTCheckbox';
import { BorrowNft } from '../../../../state/loans/types';
import Button from '../../../../components/Button';
import styles from './BorrowNft.module.scss';
import {
  SelectLayout,
  useSelectLayout,
} from '../../../../components/SelectLayout';
import { useBorrowPage } from '../../hooks';
import { BorrowForm } from '../BorrowForm';
import Icons from '../../../../iconsNew';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

interface BorrowNftProps {
  onClick: () => void;
}

const BorrowNft: FC<BorrowNftProps> = ({ onClick }) => {
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

      {!connected && (
        <Button
          type="secondary"
          className={styles.connectBtn}
          onClick={() => {
            dispatch(commonActions.setWalletModal({ isVisible: true }));
            sendAmplitudeData('loans-connect');
          }}
        >
          Connect wallet
        </Button>
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

      {connected && (
        <InfinityScroll
          itemsToShow={nfts.length}
          next={next}
          wrapperClassName={styles.nftsList}
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
      )}
    </SelectLayout>
  );
};

export default BorrowNft;
