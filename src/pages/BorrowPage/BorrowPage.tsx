import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useSelectLayout, SelectLayout } from '../../components/SelectLayout';
import { LinkWithArrow } from '../../components/LinkWithArrow';
import { SearchInput } from '../../components/SearchInput';
import NFTCheckbox from '../../components/NFTCheckbox';
import { BorrowForm } from './components/BorrowForm';
import InfinityScroll from '../../components/InfinityScroll';
import styles from './BorrowPage.module.scss';
import Button from '../../components/Button';
import { useBorrowPage } from './hooks';
import { commonActions } from '../../state/common/actions';
import { BorrowNft } from '../../state/loans/types';
import { sendAmplitudeData } from '../../utils/amplitude';
import { Controller } from 'react-hook-form';
import { Select } from '../../components/Select';
import { FilterFormInputsNames } from './hooks/useBorrowPageFilter';
import { SORT_VALUES } from './BorrowPage.constants';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

const BorrowPage: FC = () => {
  const dispatch = useDispatch();
  const { connected, onDeselect, onSelect, selectedNfts } = useSelectLayout();

  const { nfts, isLoading, searchQuery, setSearch, next, control } =
    useBorrowPage();

  return (
    <SelectLayout
      selectedNfts={selectedNfts}
      onDeselect={onDeselect}
      sidebarForm={
        <BorrowForm selectedNft={selectedNfts?.[0]} onDeselect={onDeselect} />
      }
    >
      <h1 className={styles.title}>Borrow money</h1>
      <h2 className={styles.subtitle}>
        Select your NFT to use as a collateral
      </h2>
      <div className={styles.sortWrapper}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value || '')}
          className={styles.search}
          placeholder="Search by NFT name"
        />
        <Controller
          control={control}
          name={FilterFormInputsNames.SORT}
          render={({ field: { value, name, onChange } }) => (
            <Select
              valueContainerClassName={styles.sortingSelectContainer}
              className={styles.sortingSelect}
              label="Sort by"
              options={SORT_VALUES}
              name={name}
              value={value}
              onChange={onChange}
            />
          )}
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

      {connected && !isLoading && !nfts.length && (
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
          isLoading={isLoading}
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

export default BorrowPage;
