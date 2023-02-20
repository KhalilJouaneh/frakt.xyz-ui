import { useState } from 'react';
import moment from 'moment';

import { useAuctionAccount } from '../../hooks/useAuctionAccount';
import { AuctionNFT } from '../../helpers';

export const useCollectionsTable = () => {
  const { auctionAccount } = useAuctionAccount();
  const currentTime = moment().unix();

  const isAuctionEnded = auctionAccount.duration < currentTime;

  const [priceBidValueByMint, setPriceBidValueByMint] = useState([]);

  const onChangePriceValue = (value: number, nft: AuctionNFT) => {
    const payload = { value, nftMint: nft.nftMint };

    const found =
      priceBidValueByMint.find((prev) => prev?.nftMint === payload?.nftMint) !==
      undefined;

    const state = found
      ? priceBidValueByMint.map((oldState) =>
          oldState.nftMint === payload.nftMint ? payload : oldState,
        )
      : [payload, ...priceBidValueByMint];

    setPriceBidValueByMint(state);
  };

  const getCurrentNftValue = (nft: AuctionNFT) => {
    const currentNft = priceBidValueByMint.find(
      ({ nftMint }) => nftMint === nft.nftMint,
    );
    return currentNft?.value || 0;
  };

  return {
    priceBidValueByMint,
    onChangePriceValue,
    getCurrentNftValue,
    isAuctionEnded,
  };
};
