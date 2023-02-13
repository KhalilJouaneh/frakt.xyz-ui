import { FC } from 'react';
import classNames from 'classnames';

import { AppLayout } from '@frakt/components/Layout/AppLayout';
import InfinityScroll from '@frakt/components/InfinityScroll';
import { useDebounce } from '@frakt/hooks';
import { BorrowNft } from '@frakt/api/nft';

import { BorrowHeader } from '../components/BorrowHeader';
import { Filters } from './components/Filters';
import { useWalletNfts } from './hooks';
import { NftCard } from './components/NftCard/';
import styles from './BorrowManualPage.module.scss';
import { Sidebar } from './components/Sidebar';
import { useBorrow } from '../cartState';

export const BorrowManualPage: FC = () => {
  const {
    cartOrders,
    onSelectNft,
    isBulk,
    currentNft,
    findOrderInCart,
    onRemoveNft,
  } = useBorrow();

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
    const isNftSelected =
      !!findOrderInCart({ nftMint: nft.mint }) || currentNft?.mint === nft.mint;

    if (isNftSelected) {
      return onRemoveNft(nft);
    }

    onSelectNft(nft);
  };

  return (
    <AppLayout>
      {!!currentNft && <Sidebar />}
      <div
        className={classNames([
          styles.content,
          { [styles.contentSidebarVisible]: !!currentNft },
        ])}
      >
        <BorrowHeader
          // onBackBtnClick={onBackBtnClick}
          title="Borrow SOL"
          subtitle={
            isBulk
              ? `${cartOrders.length + Number(!!currentNft)} loans in bulk`
              : 'Select NFTs to borrow against'
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
              selected={
                !!findOrderInCart({ nftMint: nft.mint }) ||
                currentNft?.mint === nft.mint
              }
              highlighted={currentNft?.mint === nft.mint}
            />
          ))}
        </InfinityScroll>
      </div>
    </AppLayout>
  );
};
