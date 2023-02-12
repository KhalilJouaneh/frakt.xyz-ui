import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';

import { RBOption } from './components/RadioButton';

export const riskMarks: { [key: string]: string | JSX.Element } = {
  10: '10%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

export const DURATION_OPTIONS: RBOption<number>[] = [
  {
    label: '7 days',
    value: 7,
  },
  {
    label: '14 days',
    value: 14,
  },
];

export const BOND_FEATURE_OPTIONS: RBOption<BondFeatures>[] = [
  {
    label: 'None',
    value: BondFeatures.None,
  },
  {
    label: 'Receive liquidated NFT',
    value: BondFeatures.ReceiveNftOnLiquidation,
  },
  {
    label: 'Autocompound',
    value: BondFeatures.Autocompound,
  },
];
