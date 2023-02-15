import { sumBy, uniq } from 'lodash';

import { Pair } from '@frakt/api/bonds';
import { LoanType } from '@frakt/api/loans';
import { Order } from '@frakt/pages/BorrowPages/cartState';
import {
  calcBondFee,
  calcTimeBasedFee,
} from '@frakt/pages/BorrowPages/helpers';

type CalcCartFees = (props: {
  orders: Order[];
  pairs: Pair[];
}) => [string, number][];
export const calcCartFees: CalcCartFees = ({ orders, pairs }) => {
  const feesByDayArr = orders.map((order) =>
    calcOrderFees({
      order,
      pair: pairs?.find(
        ({ publicKey }) =>
          publicKey === order?.bondOrderParams?.orderParams?.[0]?.pairPubkey,
      ),
    }),
  );

  return Object.entries({
    '1d': sumBy(feesByDayArr, '1d'),
    '7d': sumBy(feesByDayArr, '7d'),
    '14d': sumBy(feesByDayArr, '14d'),
    '30d': sumBy(feesByDayArr, '30d'),
    '1y': sumBy(feesByDayArr, '1y'),
  });
};

interface FeesByDay {
  '1d': number;
  '7d': number;
  '14d'?: number;
  '30d'?: number;
  '1y'?: number;
}

type CalcOrderFees = (props: { order: Order; pair?: Pair }) => FeesByDay;
const calcOrderFees: CalcOrderFees = ({ order, pair }) => {
  const { loanType, loanValue } = order;

  if (loanType === LoanType.TIME_BASED) {
    const { returnPeriodDays } = order.borrowNft.classicParams.timeBased;

    const feePerDay = calcTimeBasedFee({
      nft: order?.borrowNft,
      loanValue: order?.loanValue,
      duration: 1,
    });

    return {
      '1d': feePerDay,
      '7d': feePerDay * 7,
      '14d': returnPeriodDays === 14 ? feePerDay * 14 : null,
    };
  }

  if (loanType === LoanType.PRICE_BASED) {
    const { borrowAPRPercent } = order.borrowNft.classicParams.priceBased;

    const feePerDay = (loanValue * (borrowAPRPercent * 0.01)) / 365;

    return {
      '1d': feePerDay,
      '7d': feePerDay * 7,
      '14d': feePerDay * 14,
      '30d': feePerDay * 30,
      '1y': feePerDay * 365,
    };
  }

  if (loanType === LoanType.BOND) {
    const fee = calcBondFee({
      loanValue,
      pair,
    });
    const durationDays = pair?.validation?.durationFilter / 86400;

    return {
      '1d': fee,
      '7d': fee,
      '14d': durationDays === 14 ? fee : null,
    };
  }

  return {
    '1d': 0,
    '7d': 0,
  };
};

type IsBulkHasDifferentDurations = (props: {
  orders: Order[];
  pairs: Pair[];
}) => boolean;

export const isBulkHasDifferentDurations: IsBulkHasDifferentDurations = ({
  orders,
  pairs,
}) => {
  const durationsArr = orders.map((order) => {
    if (order.loanType === LoanType.PRICE_BASED) {
      return 'Perpetual';
    }
    if (order.loanType === LoanType.TIME_BASED) {
      return `${order.borrowNft?.classicParams?.timeBased?.returnPeriodDays}`;
    }
    if (order.loanType === LoanType.BOND) {
      const pair = pairs?.find(
        ({ publicKey }) =>
          publicKey === order?.bondOrderParams?.orderParams?.[0]?.pairPubkey,
      );

      return `${pair?.validation?.durationFilter / 86400}`;
    }

    return '';
  });

  return uniq(durationsArr).length > 1;
};
