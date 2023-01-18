import { FC } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import InfinityScroll from '@frakt/components/InfinityScroll';
import { useDebounce } from '@frakt/hooks';
import { BorrowNft } from '@frakt/api/nft';

import {
  convertBorrowNftToSelected,
  useSelectedNfts,
} from '../selectedNftsState';
import { BorrowHeader } from '../components/BorrowHeader';
import { Filters } from './components/Filters';
import { useWalletNfts } from './hooks';
import { NftCard } from './components/NftCard/';
import styles from './BorrowManualPage.module.scss';
import { Sidebar } from './components/Sidebar';

export const BorrowManualPage: FC = () => {
  const {
    selection,
    toggleNftInSelection,
    findNftInSelection,
    highlightedNftMint,
  } = useSelectedNfts();

  const history = useHistory();
  const onBackBtnClick = () => history.goBack();

  const {
    nfts,
    fetchNextPage,
    initialLoading,
    setSearch,
    setSortName,
    setSortOrder,
  } = useWalletNfts();

  const setSearchDebounced = useDebounce((value: string) => {
    setSearch(value);
  }, 300);

  const onNftClick = (nft: BorrowNft) => {
    toggleNftInSelection(convertBorrowNftToSelected(nft));
  };

  return (
    <AppLayout>
      {!!highlightedNftMint && <Sidebar />}
      <div
        className={classNames([
          styles.content,
          { [styles.contentSidebarVisible]: highlightedNftMint },
        ])}
      >
        <BorrowHeader
          onBackBtnClick={onBackBtnClick}
          title="Borrow SOL"
          subtitle={
            selection.length > 1
              ? `${selection.length} loans in bulk`
              : 'I just want to make a loan'
          }
        />
        <Filters
          setSearch={setSearchDebounced}
          onSortChange={({ name, order }) => {
            setSortName(name);
            setSortOrder(order);
          }}
        />
        <InfinityScroll
          itemsToShow={nfts.length}
          next={fetchNextPage}
          wrapperClassName={styles.nftsList}
          isLoading={initialLoading}
          customLoader={<p className={styles.loader}>loading your jpegs</p>}
        >
          {nfts.map((nft) => (
            <NftCard
              key={nft.mint}
              nft={nft}
              onClick={() => onNftClick(nft)}
              selected={!!findNftInSelection(nft.mint)}
              highlighted={nft.mint === highlightedNftMint}
            />
          ))}
        </InfinityScroll>
      </div>
    </AppLayout>
  );
};
