import { web3 } from '@frakt-protocol/frakt-sdk';
import { BorrowNft } from '@frakt/api/nft';
import { useMarket, useMarketPairs } from '@frakt/utils/bonds';
import { useMemo } from 'react';
import { getLiquidationValues } from './helpers';

export const useLoanFields = (
  nft: BorrowNft,
  solLoanValue?: number,
  selectValue?: string,
) => {
  const { valuation, timeBased } = nft;

  const { market, isLoading: isLoadingMarket } = useMarket({
    marketPubkey: nft?.marketPubkey
      ? new web3.PublicKey(nft?.marketPubkey)
      : null,
  });

  const { pairs, isLoading: isLoadingMarketPair } = useMarketPairs({
    marketPubkey: nft?.marketPubkey,
  });

  const selectedNftWithMarketInfo = useMemo(() => {
    if (!market && !pairs) return nft;

    return {
      ...nft,
      market,
      pairs,
    };
  }, [market, pairs]);

  const getBestLoanValue = (nft) => {
    // if (!nft?.marketPubkey) return rawMaxLoanValue;

    const valuationNumber = parseFloat(nft.valuation);
    const collectionFloorPriceLamports = valuationNumber * 1e9;

    return nft.pairs
      .map((pair) => {
        const loanToValueLamports =
          collectionFloorPriceLamports *
          (pair.validation.loanToValueFilter * 0.01 * 0.01);

        const maxValueBonds = Math.min(pair.bidCap, loanToValueLamports / 1e3);

        const maxValueSOLWithFee = maxValueBonds * pair.currentSpotPrice;

        return maxValueSOLWithFee / 1e9;
      })
      .sort((a, b) => a - b)
      .at(-1);
  };

  const isLoading = isLoadingMarket || isLoadingMarketPair;

  const valuationNumber = parseFloat(valuation);
  const maxLoanValueNumber = valuationNumber * (timeBased?.ltvPercents / 100);
  const maxLoanPriceValueNumber =
    valuationNumber * (nft?.priceBased?.ltvPercents / 100);
  const minLoanValueNumber = valuationNumber / 10;

  const rawMaxLoanValue =
    selectValue === 'flip' ? maxLoanValueNumber : maxLoanPriceValueNumber;

  const bestLoanValue = getBestLoanValue(selectedNftWithMarketInfo);
  console.log(bestLoanValue);
  const maxLoanValue = bestLoanValue ? bestLoanValue : rawMaxLoanValue;

  const existBestOffer = bestLoanValue > rawMaxLoanValue;

  const averageLoanValue = (maxLoanValue + minLoanValueNumber) / 2;

  const marks: { [key: number]: string | JSX.Element } = {
    [minLoanValueNumber]: `${minLoanValueNumber.toFixed(2)} SOL`,
    [maxLoanValue]: `${maxLoanValue.toFixed(2)} SOL`,
  };

  const loanTypeOptions = [
    {
      label: `${timeBased.returnPeriodDays} days`,
      value: 'flip',
    },
    {
      label: 'Perpetual',
      value: 'perpetual',
      disabled: !nft?.priceBased,
    },
  ];

  const { liquidationPrice, liquidationDrop } = getLiquidationValues(
    nft,
    solLoanValue,
  );

  return {
    marks,
    maxLoanValue,
    minLoanValueNumber,
    liquidationPrice,
    liquidationDrop,
    loanTypeOptions,
    averageLoanValue,
    isLoading,
    market,
    pairs,
    existBestOffer,
  };
};

export enum Risk {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export const getRisk = ({
  LTV,
  limits,
}: {
  LTV: number;
  limits: [number, number];
}): Risk => {
  const riskPercent = (LTV - limits[0]) / (limits[1] - limits[0]);

  if (riskPercent <= 0.5) return Risk.Low;
  if (riskPercent < 0.875) return Risk.Medium;
  return Risk.High;
};
